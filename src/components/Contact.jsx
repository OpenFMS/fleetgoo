
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, HelpCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Contact = ({ data, language }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });

  // Safety checks for data structure
  const form = data?.form || {};
  const contactInfo = data?.contactInfo || {};
  const contactInfoItems = contactInfo.items || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store in localStorage
    const inquiries = JSON.parse(localStorage.getItem('contactInquiries') || '[]');
    inquiries.push({
      ...formData,
      timestamp: new Date().toISOString(),
      language,
    });
    localStorage.setItem('contactInquiries', JSON.stringify(inquiries));

    toast({
      title: form.successTitle || "Inquiry Submitted Successfully! ✅",
      description: form.successDesc || "Thank you for your interest. Our team will contact you within 24 hours.",
    });

    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{data?.title}</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">{data?.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">{form.nameLabel}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={form.namePlaceholder}
                    required
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">{form.emailLabel}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={form.emailPlaceholder}
                    required
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-gray-300">{form.companyLabel}</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={form.companyPlaceholder}
                    required
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">{form.phoneLabel}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={form.phonePlaceholder}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-300">{form.messageLabel}</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={form.messagePlaceholder}
                  required
                  rows={6}
                  className="bg-slate-900 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-6 text-lg rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 hover:scale-105"
              >
                {form.submitButton}
                <Send className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">{contactInfo.title}</h3>
              <div className="space-y-6">
                {contactInfoItems.map((info, index) => {
                  const Icon = LucideIcons[info.icon] || HelpCircle;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">{info.label}</div>
                        <div className="text-white font-medium">{info.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-64">
              <img 
                alt="Modern office building headquarters" 
                className="w-full h-full object-cover" 
                src={data?.officeImage || "https://images.unsplash.com/photo-1697673468681-d536aa3bc870"} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
