import React, { useState } from 'react';
import { Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import tiffinlyLogo from '@/assets/tiffinly-logo.png';

export const LoginScreen = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePhoneSubmit = () => {
    if (phone.length === 10) {
      setStep('otp');
    }
  };

  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center pt-12 pb-8">
        <div className="flex items-center space-x-3">
          <img src={tiffinlyLogo} alt="Tiffinly" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-foreground">Tiffinly</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">
        <Card className="p-6 shadow-elevated animate-slide-up">
          {step === 'phone' ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-muted-foreground">
                  Enter your mobile number to continue
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-12 h-12 text-lg"
                  />
                </div>

                <Button 
                  onClick={handlePhoneSubmit}
                  disabled={phone.length !== 10}
                  className="w-full"
                  size="lg"
                >
                  Send OTP
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button className="text-primary font-medium">
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
                <p className="text-muted-foreground">
                  Enter the 6-digit code sent to +91 {phone}
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-12 text-lg text-center tracking-widest"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>

                <Button 
                  onClick={handleOtpSubmit}
                  disabled={otp.length !== 6}
                  className="w-full"
                  size="lg"
                >
                  Verify & Continue
                </Button>

                <div className="flex justify-between text-sm">
                  <button 
                    onClick={() => setStep('phone')}
                    className="text-muted-foreground"
                  >
                    Change number
                  </button>
                  <button className="text-primary font-medium">
                    Resend OTP
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>By continuing, you agree to our</p>
          <p>
            <span className="text-primary">Terms of Service</span> and{' '}
            <span className="text-primary">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};