"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  IconCalculator,
  IconTruckDelivery,
  IconPackage,
  IconMapPin,
  IconTruckDelivery as IconDelivery,
  IconScale,
  IconCash,
  IconArrowRight,
} from "@tabler/icons-react";

const PriceCalculator = () => {
  const [formData, setFormData] = useState({
    pickup: "",
    delivery: "",
    weight: "",
    value: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Calculate distance based on locations
    const calculateDistance = (from: string, to: string) => {
      const mockDistances: Record<string, Record<string, number>> = {
        mumbai: { delhi: 1400, surat: 300, kolkata: 2000 },
        delhi: { mumbai: 1400, surat: 1200, kolkata: 1500 },
        surat: { mumbai: 300, delhi: 1200, kolkata: 1900 },
        kolkata: { mumbai: 2000, delhi: 1500, surat: 1900 },
      };

      from = from.toLowerCase();
      to = to.toLowerCase();

      if (mockDistances[from] && mockDistances[from][to]) {
        return mockDistances[from][to];
      }

      return Math.floor(800 + Math.random() * 1200);
    };

    // Simulate calculation
    setTimeout(() => {
      const distance = calculateDistance(formData.pickup, formData.delivery);
      const weight = parseFloat(formData.weight) || 10;
      const value = parseFloat(formData.value) || 1000;

      const baseRate = weight * 2.5; // $2.5 per kg
      const distanceRate = distance * 0.1; // $0.1 per km
      const valueRate = value * 0.02; // 2% of invoice value
      const optimalRate = baseRate + distanceRate + valueRate;
      const deliveryDays = Math.ceil(distance / 500);

      setResult({
        rate: optimalRate.toFixed(2),
        distance,
        time: deliveryDays,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 md:p-8 bg-gradient-to-b from-zinc-800 to-zinc-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-zinc-800/50 border border-zinc-700/50 shadow-xl rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <IconCalculator size={28} className="text-blue-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Logistics Rate Calculator
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Pickup Location"
                  id="pickup"
                  value={formData.pickup}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  required
                  icon={<IconMapPin className="h-4 w-4 text-zinc-500" />}
                  hint="Try: Mumbai, Delhi, Surat, Kolkata"
                />

                <FormField
                  label="Delivery Location"
                  id="delivery"
                  value={formData.delivery}
                  onChange={handleChange}
                  placeholder="Delhi"
                  required
                  icon={<IconDelivery className="h-4 w-4 text-zinc-500" />}
                  hint="Try: Mumbai, Delhi, Surat, Kolkata"
                />

                <FormField
                  label="Weight (kg)"
                  id="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="10.5"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  icon={<IconScale className="h-4 w-4 text-zinc-500" />}
                />

                <FormField
                  label="Invoice Value ($)"
                  id="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="1000.00"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  icon={<IconCash className="h-4 w-4 text-zinc-500" />}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  variant="default"
                  className="relative group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] px-8"
                >
                  <span className="flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Calculating...</span>
                      </>
                    ) : (
                      <>
                        <span>Calculate Optimal Rate</span>
                        <IconArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </span>
                  <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                  <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                </Button>
              </div>
            </motion.form>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center mt-8 p-6"
              >
                <div className="w-16 h-16 border-4 border-blue-200/20 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-zinc-300">
                  Calculating optimal rate...
                </p>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <div className="bg-zinc-700/30 border border-zinc-600/50 rounded-xl overflow-hidden">
                  <div className="p-6 pb-2">
                    <h3 className="text-xl font-bold text-blue-400">
                      Calculated Logistics Rate
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ResultCard
                        icon={<IconCalculator size={20} />}
                        label="Optimal Rate"
                        value={`$${result.rate}`}
                      />
                      <ResultCard
                        icon={<IconTruckDelivery size={20} />}
                        label="Estimated Distance"
                        value={`${result.distance} km`}
                      />
                      <ResultCard
                        icon={<IconPackage size={20} />}
                        label="Delivery Time"
                        value={`${result.time} day(s)`}
                      />
                    </div>

                    <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800/30 relative group/info hover:border-blue-700/50 transition-all">
                      <div className="flex items-start">
                        <div className="text-blue-400 mr-3">💡</div>
                        <p className="text-sm text-blue-300">
                          This rate is calculated based on weight, distance, and
                          package value. For special shipping requirements or
                          bulk orders, please contact our team.
                        </p>
                      </div>
                      <CardBottomGradient />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Card bottom gradient effect
const CardBottomGradient = () => {
  return (
    <>
      <span className="group-hover/card:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      <span className="group-hover/card:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    </>
  );
};

// Form field component
interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
  step?: string;
  icon?: React.ReactNode;
  hint?: string;
}

const FormField = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
  step,
  icon,
  hint,
}: FormFieldProps) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <Label htmlFor={id} className="text-zinc-300">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3">{icon}</div>}
        <Input
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          min={min}
          step={step}
          required={required}
          className="w-full pl-10 p-3 bg-zinc-700/50 text-white rounded-lg border border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
      {hint && <p className="text-xs text-zinc-400 mt-1">{hint}</p>}
    </div>
  );
};

// Result card component
interface ResultCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ResultCard = ({ icon, label, value }: ResultCardProps) => {
  return (
    <div className="p-4 bg-zinc-800/80 border border-zinc-700/50 rounded-lg relative group/card hover:border-blue-500/50 transition-all">
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-blue-400">{icon}</div>
        <p className="text-sm text-zinc-400">{label}</p>
      </div>
      <p className="text-2xl font-bold text-blue-300">{value}</p>
      <CardBottomGradient />
    </div>
  );
};

export default PriceCalculator;