import GoogleButton from '@/components/custom/buttons/GoogleButton';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function SignUp() {
  return (
    <main className="h-dvh">
      <div className="flex flex-col h-full justify-center items-center mx-auto max-w-[300px] space-y-3">
        <Input />
        <Input />
        <div className='w-full'>
          <Separator
            orientation="horizontal"
            className="flex flex-col items-center my-4"
          >
            <div className="translate-y-[-12px] bg-white w-min px-2">or</div>
          </Separator>
        </div>
        <GoogleButton />
      </div>
    </main>
  );
}
