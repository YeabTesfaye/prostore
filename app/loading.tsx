import loadder from '@/assets/loader.gif';
import Image from 'next/image';

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Image src={loadder} width={150} height={150} alt="Loading..." />
    </div>
  );
};

export default Loading;
