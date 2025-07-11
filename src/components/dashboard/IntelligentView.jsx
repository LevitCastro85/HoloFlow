import React from 'react';
import { BarChart, Briefcase, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';

const RankingList = ({ title, items, icon: Icon, color }) => (
  <div className="space-y-3">
    {items.map((item, index) => (
      <div
        key={item.id}
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white bg-${color}-500`}
          >
            {index + 1}
          </div>
          <div>
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className={`text-sm text-${color}-600`}>
              {item.metric === 'MXN' ? formatCurrency(item.value) : `${item.value} ${item.metric}`}
            </p>
          </div>
        </div>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
    ))}
  </div>
);

export default function IntelligentView({ rankings }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Vista Inteligente
      </h2>
      <Tabs defaultValue="brands" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brands">
            <Briefcase className="w-4 h-4 mr-2" /> Top Marcas
          </TabsTrigger>
          <TabsTrigger value="services">
            <TrendingUp className="w-4 h-4 mr-2" /> Top Servicios
          </TabsTrigger>
          <TabsTrigger value="contracts">
            <BarChart className="w-4 h-4 mr-2" /> Top Contratos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="brands" className="mt-4">
          <RankingList
            title="Marcas con más tareas"
            items={rankings.topBrands}
            icon={Briefcase}
            color="purple"
          />
        </TabsContent>
        <TabsContent value="services" className="mt-4">
          <RankingList
            title="Servicios más solicitados"
            items={rankings.topServices}
            icon={TrendingUp}
            color="blue"
          />
        </TabsContent>
        <TabsContent value="contracts" className="mt-4">
          <RankingList
            title="Contratos de mayor valor"
            items={rankings.topContracts}
            icon={BarChart}
            color="green"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}