
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { productsData } from '@/pages/ProductsPage';

const productTitles = {
  en: {
    title: 'Our Products',
    subtitle: 'Cutting-edge hardware solutions for complete vehicle monitoring',
    gpsTitle: 'GPS Tracker',
    gpsDesc: 'Real-time location tracking with global coverage, geofencing, and advanced analytics',
    dashcamTitle: '4G Dashcam',
    dashcamDesc: 'High-definition recording with live streaming, AI driver monitoring, and cloud storage',
    mdvrTitle: 'MDVR System',
    mdvrDesc: 'Multi-channel digital video recorder with 4G connectivity and remote access',
    displayTitle: 'Smart Display',
    displayDesc: 'Interactive driver display with navigation, alerts, and performance metrics',
  },
  es: {
    title: 'Nuestros Productos',
    subtitle: 'Soluciones de hardware de vanguardia para monitoreo vehicular completo',
    gpsTitle: 'Rastreador GPS',
    gpsDesc: 'Seguimiento de ubicación en tiempo real con cobertura global, geocercas y análisis avanzado',
    dashcamTitle: 'Dashcam 4G',
    dashcamDesc: 'Grabación de alta definición con transmisión en vivo, monitoreo de conductor IA y almacenamiento en la nube',
    mdvrTitle: 'Sistema MDVR',
    mdvrDesc: 'Grabadora de video digital multicanal con conectividad 4G y acceso remoto',
    displayTitle: 'Pantalla Inteligente',
    displayDesc: 'Pantalla interactiva del conductor con navegación, alertas y métricas de rendimiento',
  },
  zh: {
    title: '我们的产品',
    subtitle: '用于完整车辆监控的尖端硬件解决方案',
    gpsTitle: 'GPS追踪器',
    gpsDesc: '全球覆盖的实时位置追踪、地理围栏和高级分析',
    dashcamTitle: '4G行车记录仪',
    dashcamDesc: '高清录制，实时流媒体、AI驾驶员监控和云存储',
    mdvrTitle: 'MDVR系统',
    mdvrDesc: '带4G连接和远程访问的多通道数字录像机',
    displayTitle: '智能显示屏',
    displayDesc: '带导航、警报和性能指标的交互式驾驶员显示屏',
  },
};

const Products = ({ language }) => {
  const t = productTitles[language];

  return (
    <div className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.title}</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">{t.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsData.map((product, index) => {
            const displayProduct = {
              ...product,
              title: t[product.titleKey],
              description: t[product.descKey],
            };
            
            return (
              <Link to={`/products/${product.id}`} key={product.id}>
                <ProductCard product={displayProduct} index={index} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;
