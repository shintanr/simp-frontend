import Image from "next/image";

interface PraktikumCardProps {
  name: string;
  schedule: string;
  imageSrc: string;
}

const PraktikumCard: React.FC<PraktikumCardProps> = ({ name, schedule, imageSrc }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      {/* Gambar di bagian atas */}
      <Image 
        src={imageSrc} 
        alt={name} 
        width={500} 
        height={200} 
        className="w-full h-32 object-cover"
        unoptimized={true}
      />
      
      {/* Konten card */}
      <div className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm text-gray-600">{schedule}</p>
      </div>
    </div>
  );
};

export default PraktikumCard;
