
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Building2, Package, Users } from 'lucide-react';

const translations = {
  en: {
    title: 'Industry Solutions',
    subtitle: 'Tailored solutions for every fleet type',
    logistics: 'Logistics & Transportation',
    logisticsDesc: 'Optimize delivery routes, reduce fuel costs, and improve on-time performance',
    construction: 'Construction & Heavy Equipment',
    constructionDesc: 'Track equipment utilization, prevent theft, and manage maintenance schedules',
    delivery: 'Last-Mile Delivery',
    deliveryDesc: 'Real-time tracking, proof of delivery, and customer notifications',
    corporate: 'Corporate Fleet',
    corporateDesc: 'Employee safety monitoring, expense management, and policy compliance',
  },
  es: {
    title: 'Soluciones Industriales',
    subtitle: 'Soluciones personalizadas para cada tipo de flota',
    logistics: 'Logística y Transporte',
    logisticsDesc: 'Optimice rutas de entrega, reduzca costos de combustible y mejore el rendimiento a tiempo',
    construction: 'Construcción y Equipo Pesado',
    constructionDesc: 'Rastree la utilización del equipo, prevenga robos y gestione programas de mantenimiento',
    delivery: 'Entrega de Última Milla',
    deliveryDesc: 'Seguimiento en tiempo real, prueba de entrega y notificaciones al cliente',
    corporate: 'Flota Corporativa',
    corporateDesc: 'Monitoreo de seguridad de empleados, gestión de gastos y cumplimiento de políticas',
  },
  zh: {
    title: '行业解决方案',
    subtitle: '为每种车队类型量身定制的解决方案',
    logistics: '物流与运输',
    logisticsDesc: '优化配送路线，降低燃料成本，提高准时绩效',
    construction: '建筑与重型设备',
    constructionDesc: '跟踪设备利用率，防止盗窃，管理维护计划',
    delivery: '最后一公里配送',
    deliveryDesc: '实时跟踪、交付证明和客户通知',
    corporate: '企业车队',
    corporateDesc: '员工安全监控、费用管理和政策合规',
  },
};

const Solutions = ({ language }) => {
  const t = translations[language];

  const solutions = [
    {
      icon: Truck,
      title: t.logistics,
      description: t.logisticsDesc,
      color: 'blue',
    },
    {
      icon: Building2,
      title: t.construction,
      description: t.constructionDesc,
      color: 'cyan',
    },
    {
      icon: Package,
      title: t.delivery,
      description: t.deliveryDesc,
      color: 'indigo',
    },
    {
      icon: Users,
      title: t.corporate,
      description: t.corporateDesc,
      color: 'sky',
    },
  ];

  return (
    <div className="py-20 bg-slate-900">
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

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${solution.color}-500/10 border border-${solution.color}-500/20 mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 text-${solution.color}-400`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {solution.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {solution.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Solutions;
