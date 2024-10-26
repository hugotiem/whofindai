// 'use client';

// import { signInWithMicrosoft } from '@/lib/firebase/auth';
// import { Loader2 } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { Button } from '../ui/button';
// import { useProgressBar } from '@/hooks/use-progress-bar';
// import { MicrosoftIcon } from '../icons/Microsoft';

// interface MicrosoftButtonRrops {
//   autoLogin?: boolean;
//   onClick?: () => void;
// }

// const MicrosoftButton = ({
//   autoLogin = true,
//   onClick
// }: MicrosoftButtonRrops) => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const { showProgress } = useProgressBar();

//   const handleLogin = (e: any) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);

//     signInWithMicrosoft(() => showProgress())
//       .then((_) => {
//         router.replace('/api/auth/session/create');
//       })
//       .catch((e) => {
//         setLoading(false);
//       });
//   };

//   return (
//     <Button
//       className="relative"
//       onSubmit={() => {}}
//       onClick={autoLogin ? handleLogin : onClick}
//       variant="outline"
//       size="appXlFull"
//     >
//       <Loader2
//         className="animate-spin absolute"
//         style={{
//           display: loading ? 'block' : 'none'
//         }}
//       />

//       <div
//         className="flex items-center space-x-3 justify-center"
//         style={{ opacity: loading ? 0 : 1 }}
//       >
//         <MicrosoftIcon />
//         <span>Continue With Microsoft</span>
//       </div>
//     </Button>
//   );
// };

// export default MicrosoftButton;
