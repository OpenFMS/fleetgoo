import React, { useState } from 'react';
import { Send, ArrowRight } from 'lucide-react';
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

const defaultLabels = {
    name: "Name",
    email: "Email",
    company: "Company",
    phone: "Phone",
    productInterest: "Product Interest",
    message: "Message",
    submitBtn: "Send Message",
    privacyNote: "We respect your privacy. Your information is safe with us."
};

const ContactForm = ({ labels = {}, language = 'en', className = "" }) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Merge default labels with provided labels
    const ui = { ...defaultLabels, ...labels };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        productInterest: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, productInterest: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call and store in localStorage (Mock Backend)
        setTimeout(() => {
            const inquiries = JSON.parse(localStorage.getItem('contactInquiries') || '[]');
            inquiries.push({
                ...formData,
                timestamp: new Date().toISOString(),
                language,
                sourcePage: window.location.pathname // Activity tracking
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
            setIsSubmitting(false);
        }, 1000); // 1s delay simulation
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 dark:text-gray-300">
                        {ui.name} <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="email" className="text-slate-700 dark:text-gray-300">
                        {ui.email} <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="company" className="text-slate-700 dark:text-gray-300">{ui.company}</Label>
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
                    <Label htmlFor="phone" className="text-slate-700 dark:text-gray-300">{ui.phone}</Label>
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
                <Label htmlFor="product-interest" className="text-slate-700 dark:text-gray-300">{ui.productInterest}</Label>
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
                <Label htmlFor="message" className="text-slate-700 dark:text-gray-300">{ui.message}</Label>
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
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 hover:scale-105"
            >
                {isSubmitting ? 'Sending...' : ui.submitBtn}
                {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
            <p className="text-center text-xs text-slate-500 dark:text-gray-500 mt-4">
                {ui.privacyNote}
            </p>
        </form>
    );
};

export default ContactForm;
