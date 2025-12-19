
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, HelpCircle, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Contact = ({ data, language }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    productInterest: '',
    message: '',
  });

  // Safety checks for data structure
  const form = data?.form || {};
  const contactInfo = data?.contactInfo || {};
  const contactInfoItems = contactInfo.items || [];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate API call and store in localStorage
    const inquiries = JSON.parse(localStorage.getItem('contactInquiries') || '[]');
    inquiries.push({
      ...formData,
      timestamp: new Date().toISOString(),
      language,
    });
    localStorage.setItem('contactInquiries', JSON.stringify(inquiries));

    toast({
      title: "Quote Request Sent!",
      description: "Thank you for your inquiry. Our team will contact you shortly.",
    });

    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      productInterest: '',
      message: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      productInterest: value
    });
  };

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">{data?.title}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{data?.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl dark:shadow-none">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 dark:text-gray-300">Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-gray-300">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                    className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-slate-700 dark:text-gray-300">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Logistics"
                    className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 dark:text-gray-300">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-interest" className="text-slate-700 dark:text-gray-300">Product Interest</Label>
                <Select onValueChange={handleSelectChange} value={formData.productInterest}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white w-full">
                    <SelectValue placeholder="Select a product..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <SelectItem value="d510">D510 AI Dashcam</SelectItem>
                    <SelectItem value="d901">D901 MDVR System</SelectItem>
                    <SelectItem value="platform">Software Platform</SelectItem>
                    <SelectItem value="other">Other / General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700 dark:text-gray-300">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your fleet size and specific requirements..."
                  rows={6}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 hover:scale-105"
              >
                Send Message
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-center text-xs text-slate-500 dark:text-gray-500 mt-4">
                We respect your privacy. Your information is safe with us.
              </p>
            </form>
          </motion.div>

          {/* Contact Info (Right Side) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-600/20 dark:to-cyan-600/20 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-8 shadow-lg dark:shadow-none">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{contactInfo.title}</h3>
              <div className="space-y-6">
                {contactInfoItems.map((info, index) => {
                  const Icon = LucideIcons[info.icon] || HelpCircle;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-gray-400 mb-1">{info.label}</div>
                        <div className="text-slate-900 dark:text-white font-medium">{info.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-64 shadow-xl dark:shadow-none">
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
