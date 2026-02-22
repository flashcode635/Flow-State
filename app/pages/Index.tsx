import { useRoutineStore } from '@/app/store/useRoutineStore';
import Onboarding from '@/app/components/Onboarding';
import Dashboard from '@/app/components/Dashboard';

const Index = () => {
  const onboarded = useRoutineStore(s => s.onboarded);

  return onboarded ? <Dashboard /> : <Onboarding />;
};

export default Index;
