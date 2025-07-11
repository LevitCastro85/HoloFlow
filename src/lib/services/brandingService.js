import { supabase } from '@/lib/customSupabaseClient';

const generateExampleBrandingData = (brand, clientId) => {
    const brandName = brand.name || 'Marca';
    const brandIndustry = brand.industry || 'general';
    
    return {
      briefGeneral: `${brandName} es una marca ${brandIndustry.toLowerCase()} que busca conectar con su audiencia a través de una comunicación auténtica y valores sólidos. Nuestro enfoque se centra en la calidad, innovación y experiencia del cliente.`,
      slogan: brandName === 'SportXYZ' ? 'Supera tus límites' : 
              brandName === 'Natural Glow' ? 'Belleza que nace de ti' :
              brandName === 'Urban Style' ? 'Tu estilo, tu ciudad' : 'Excelencia en cada detalle',
      mision: `Proporcionar productos/servicios de alta calidad en el sector ${brandIndustry.toLowerCase()}, superando las expectativas de nuestros clientes y contribuyendo positivamente a la comunidad.`,
      vision: `Ser la marca líder en ${brandIndustry.toLowerCase()}, reconocida por nuestra innovación, calidad y compromiso con la excelencia.`,
      valores: 'Calidad, Innovación, Integridad, Compromiso con el cliente, Responsabilidad social, Excelencia operativa',
      paletaColores: {
        primario: brandName === 'SportXYZ' ? '#FF6B35' : 
                  brandName === 'Natural Glow' ? '#8FBC8F' :
                  brandName === 'Urban Style' ? '#2C3E50' : '#0066cc',
        secundario: brandName === 'SportXYZ' ? '#004E89' : 
                    brandName === 'Natural Glow' ? '#F5F5DC' :
                    brandName === 'Urban Style' ? '#E74C3C' : '#ffffff',
        acento: brandName === 'SportXYZ' ? '#FFD23F' : 
                brandName === 'Natural Glow' ? '#DDA0DD' :
                brandName === 'Urban Style' ? '#F39C12' : '#ff6b35',
        adicionales: ['#F8F9FA', '#6C757D']
      },
      tipografias: {
        principal: brandName === 'SportXYZ' ? 'Montserrat' : 
                   brandName === 'Natural Glow' ? 'Playfair Display' :
                   brandName === 'Urban Style' ? 'Roboto' : 'Open Sans',
        secundaria: brandName === 'SportXYZ' ? 'Open Sans' : 
                    brandName === 'Natural Glow' ? 'Source Sans Pro' :
                    brandName === 'Urban Style' ? 'Lato' : 'Roboto',
        notas: 'La tipografía principal se usa para títulos y elementos destacados. La secundaria para textos largos y contenido general.'
      },
      bibliotecaFotografica: {
        notes: `Las fotografías de ${brandName} deben reflejar ${brandIndustry.toLowerCase() === 'tecnologia' ? 'innovación y modernidad' : brandIndustry.toLowerCase() === 'salud' ? 'bienestar y confianza' : 'calidad y profesionalismo'}. Se recomienda usar una paleta de colores consistente con la identidad de marca y mantener un estilo visual coherente en todas las imágenes.`,
        photos: []
      },
      tonoComunicacion: {
        personalidad: brandName === 'SportXYZ' ? 'Energética, motivadora, desafiante, inclusiva' : 
                      brandName === 'Natural Glow' ? 'Cálida, auténtica, consciente, inspiradora' :
                      brandName === 'Urban Style' ? 'Moderna, urbana, versátil, accesible' : 'Profesional, confiable, innovadora',
        voz: brandName === 'SportXYZ' ? 'Motivadora y energética, que inspira a superar límites' : 
             brandName === 'Natural Glow' ? 'Cálida y cercana, que transmite confianza y naturalidad' :
             brandName === 'Urban Style' ? 'Moderna y directa, que conecta con el estilo de vida urbano' : 'Experta y accesible',
        estilo: 'Directo pero amigable, usando un lenguaje claro y accesible. Evitamos tecnicismos innecesarios.',
        ejemplos: brandName === 'SportXYZ' ? '¡Es hora de superar tus límites! • Tu mejor versión te espera • Entrena con propósito' : 
                  brandName === 'Natural Glow' ? 'Descubre la belleza que ya tienes • Ingredientes que cuidan de ti • Tu piel, tu historia' :
                  brandName === 'Urban Style' ? 'Tu estilo, sin límites • Moda que se adapta a ti • Viste la ciudad' : 'Calidad que marca la diferencia'
      }
    };
};

export const brandingService = {
    async getBrandingForBrand(brandId) {
        const { data, error } = await supabase
            .from('brandings')
            .select('data')
            .eq('brand_id', brandId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data ? data.data : null;
    },

    async saveBrandingData(brandId, brandingData, clientId) {
        const { error } = await supabase
            .from('brandings')
            .upsert(
                {
                    brand_id: brandId,
                    client_id: clientId,
                    data: brandingData,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: 'brand_id',
                }
            );

        if (error) {
            throw error;
        }
    },
    
    generateExampleBrandingData,
};