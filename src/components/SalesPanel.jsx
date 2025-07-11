import React, { useState, useEffect } from 'react';
    import { 
      Plus, 
      Eye, 
      FileText,
      Users,
      Clock,
      RefreshCw,
      Calendar,
      Infinity
    } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { toast } from '@/components/ui/use-toast';
    import SaleModal from '@/components/sales/SaleModal';
    import SalesTable from '@/components/sales/SalesTable';
    import ClientSalesView from '@/components/sales/ClientSalesView';
    import SalesMetrics from '@/components/sales/SalesMetrics';
    import RenewalAlerts from '@/components/sales/RenewalAlerts';
    import SalesOverview from '@/components/sales/SalesOverview';
    import { contractsService, clientsService, servicesService } from '@/lib/supabaseHelpers';

    const frequencyConfig = {
      'unica': { label: 'Única', icon: Clock, color: 'text-gray-600', bgColor: 'bg-gray-100' },
      'mensual': { label: 'Mensual', icon: RefreshCw, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'campaña': { label: 'Por Campaña', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100' }
    };

    const periodTypeConfig = {
      'fijo': { label: 'Fijo', icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-100' },
      'renovable': { label: 'Renovable', icon: RefreshCw, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'indeterminado': { label: 'Indeterminado', icon: Infinity, color: 'text-purple-600', bgColor: 'bg-purple-100' }
    };

    export default function SalesPanel() {
      const [activeTab, setActiveTab] = useState('overview');
      const [sales, setSales] = useState([]);
      const [clients, setClients] = useState([]);
      const [services, setServices] = useState([]);
      const [editingSale, setEditingSale] = useState(null);
      const [showSaleModal, setShowSaleModal] = useState(false);
      const [loading, setLoading] = useState(true);

      const loadData = async () => {
        setLoading(true);
        try {
          const [salesData, clientsData, servicesData] = await Promise.all([
            contractsService.getAll(),
            clientsService.getAll(),
            servicesService.getAll()
          ]);
          setSales(salesData || []);
          setClients(clientsData || []);
          setServices(servicesData || []);
        } catch (error) {
          toast({ title: "Error", description: "No se pudieron cargar los datos de ventas.", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        loadData();
      }, []);

      const handleAddSale = () => {
        setEditingSale(null);
        setShowSaleModal(true);
      };

      const handleEditSale = (sale) => {
        setEditingSale({ ...sale });
        setShowSaleModal(true);
      };

      const handleSaveSale = async (saleData) => {
        try {
          if (saleData.id) {
            await contractsService.update(saleData.id, saleData);
          } else {
            await contractsService.create(saleData);
          }
          setShowSaleModal(false);
          setEditingSale(null);
          loadData();
          toast({ title: "Éxito", description: `Venta ${saleData.id ? 'actualizada' : 'creada'} correctamente.` });
        } catch (error) {
          toast({ title: "Error", description: "No se pudo guardar la venta.", variant: "destructive" });
        }
      };

      const isContractActive = (sale) => {
        const today = new Date();
        const startDate = new Date(sale.start_date);
        const endDate = sale.end_date ? new Date(sale.end_date) : null;

        if (sale.period_type === 'indeterminado') {
          return today >= startDate;
        }

        if (endDate) {
          return today >= startDate && today <= endDate;
        }

        return today >= startDate;
      };

      const getContractStatus = (sale) => {
        if (!isContractActive(sale)) {
          return { label: 'Finalizado', color: 'text-gray-600', bgColor: 'bg-gray-100' };
        }

        if (sale.end_date) {
          const endDate = new Date(sale.end_date);
          const today = new Date();
          const daysUntilEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

          if (daysUntilEnd <= 30 && sale.period_type === 'renovable') {
            return { label: 'Próximo a renovar', color: 'text-orange-600', bgColor: 'bg-orange-100' };
          }
        }

        return { label: 'Activo', color: 'text-green-600', bgColor: 'bg-green-100' };
      };

      const getActiveSales = () => sales.filter(isContractActive);
      
      const getRenewalAlerts = () => {
        return sales.filter(sale => {
          if (!sale.end_date || sale.period_type !== 'renovable') return false;
          const endDate = new Date(sale.end_date);
          const today = new Date();
          const daysUntilEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          return daysUntilEnd <= 30 && daysUntilEnd > 0;
        });
      };

      const getTotalRevenue = () => {
        return getActiveSales().reduce((total, sale) => {
          if (sale.frequency === 'mensual') {
            return total + (sale.final_price * 12);
          }
          return total + sale.final_price;
        }, 0);
      };

      if (loading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
      }

      const activeSales = getActiveSales();
      const renewalAlerts = getRenewalAlerts();

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ventas y Contrataciones</h1>
              <p className="text-gray-600 mt-1">Gestiona los servicios vendidos y contratos activos</p>
            </div>
            
            <Button onClick={handleAddSale}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Venta
            </Button>
          </div>

          <SalesMetrics 
            activeSales={activeSales.length}
            renewalAlerts={renewalAlerts.length}
            totalSales={sales.length}
            totalRevenue={getTotalRevenue()}
          />

          <RenewalAlerts 
            renewalAlerts={renewalAlerts}
            onEditSale={handleEditSale}
          />

          <div className="bg-white rounded-xl shadow-sm border">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Vista General
                </button>
                <button
                  onClick={() => setActiveTab('table')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'table'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Tabla Completa
                </button>
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'clients'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Por Cliente
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <SalesOverview 
                  activeSales={activeSales}
                  getContractStatus={getContractStatus}
                  frequencyConfig={frequencyConfig}
                  periodTypeConfig={periodTypeConfig}
                  onEditSale={handleEditSale}
                />
              )}

              {activeTab === 'table' && (
                <SalesTable 
                  sales={sales}
                  onEditSale={handleEditSale}
                  getContractStatus={getContractStatus}
                  isContractActive={isContractActive}
                  frequencyConfig={frequencyConfig}
                  periodTypeConfig={periodTypeConfig}
                />
              )}

              {activeTab === 'clients' && (
                <ClientSalesView 
                  clients={clients}
                  sales={sales}
                  onEditSale={handleEditSale}
                  getContractStatus={getContractStatus}
                  frequencyConfig={frequencyConfig}
                />
              )}
            </div>
          </div>

          <SaleModal 
            show={showSaleModal}
            onClose={() => setShowSaleModal(false)}
            editingSale={editingSale}
            setEditingSale={setEditingSale}
            onSave={handleSaveSale}
            clients={clients}
            services={services}
            frequencyConfig={frequencyConfig}
            periodTypeConfig={periodTypeConfig}
          />
        </div>
      );
    }