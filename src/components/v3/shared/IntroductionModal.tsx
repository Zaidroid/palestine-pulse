import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useV3Store } from '@/store/v3Store';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { BarChart, Database, Target, ArrowRight, Map, Users, ShieldCheck } from 'lucide-react';
import { Logo } from '../layout/Logo';

const IntroductionModal = () => {
  const [step, setStep] = useState(0);
  const { isFirstVisit, setFirstVisit } = useV3Store(state => ({
    isFirstVisit: state.isFirstVisit,
    setFirstVisit: state.setFirstVisit,
  }));

  const steps = [
    {
      icon: (
        <div className="relative flex h-32 w-32 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute h-full w-full rounded-full border-2 border-dashed border-primary/50"
          />
          <Logo className="h-20 w-20 text-primary" />
        </div>
      ),
      title: 'Welcome to Palestine Pulse',
      content: 'An independent, open-source platform providing a real-time, data-driven view of the humanitarian situation in Palestine.',
    },
    {
      icon: (
        <div className="relative flex h-32 w-32 items-center justify-center">
          <Database className="h-16 w-16 text-primary" />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <ShieldCheck className="h-5 w-5" />
          </motion.div>
        </div>
      ),
      title: 'Consolidated & Verified Data',
      content: (
        <span>
          We ingest and consolidate data from a multitude of trusted sources, including the <b className="font-bold text-foreground">UN</b>, <b className="font-bold text-foreground">WHO</b>, and <b className="font-bold text-foreground">World Bank</b>, to provide a comprehensive and verified picture.
        </span>
      ),
    },
    {
      icon: (
        <div className="relative flex h-32 w-32 items-center justify-center">
          <Map className="h-16 w-16 text-primary" />
          <Users className="absolute bottom-0 right-0 h-10 w-10 text-primary/70" />
        </div>
      ),
      title: 'Dual-Dashboard Experience',
      content: 'Explore two distinct but interconnected dashboards: the War on Gaza and the West Bank Occupation, each with detailed sub-tabs for in-depth analysis.',
    },
    {
      icon: <ArrowRight className="h-20 w-20 text-primary" />,
      title: "Let's Begin",
      content: 'You are now ready to explore the dashboard. Click "Begin" to start.',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setFirstVisit(false);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  if (!isFirstVisit) {
    return null;
  }

  return (
    <Dialog open={isFirstVisit} onOpenChange={() => setFirstVisit(false)}>
      <DialogContent className="sm:max-w-2xl w-full h-auto md:h-3/4 flex flex-col p-0">
        <VisuallyHidden>
          <DialogTitle>{steps[step].title}</DialogTitle>
        </VisuallyHidden>
        <div className="flex-grow flex items-center justify-center p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mb-6"
              >
                {steps[step].icon}
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{steps[step].title}</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">{steps[step].content}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between p-6 bg-muted/50 border-t">
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${step === i ? 'w-6 bg-primary' : 'bg-muted-foreground/50'}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="lg" onClick={handlePrev}>
                Previous
              </Button>
            )}
            <Button size="lg" onClick={handleNext}>
              {step === steps.length - 1 ? 'Begin' : 'Next'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntroductionModal;