import React from "react";
import { BookOpen, ClipboardList, FileCheck, NotebookPen, Award } from "lucide-react";

// --- Type Definitions ---

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

interface MenuItem {
  title: string;
  icon: React.ReactElement; // For JSX elements
  url: string;
}

// --- Component Implementations ---

const Avatar: React.FC<AvatarProps> = ({ children, className }) => (
  <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className ?? ''}`}>
    {children}
  </div>
);

const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={`aspect-square h-full w-full ${className ?? ''}`} />
);

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-300 ${className ?? ''}`}>
    {children}
  </div>
);

const Header: React.FC = () => { // No props for Header in this example
  const menuItems: MenuItem[] = [
    {
      title: "Praktikum",
      icon: <BookOpen className="w-5 h-5" />,
      url: "http://localhost:3000/"
    },
    {
      title: "TP",
      icon: <NotebookPen className="w-5 h-5" />,
      url: "http://localhost:3000/tugas-pendahuluan"
    },
    {
      title: "Presensi",
      icon: <ClipboardList className="w-5 h-5" />,
      url: "http://localhost:3000/presensi"
    },
    {
      title: "Submission",
      icon: <FileCheck className="w-5 h-5" />,
      url: "http://localhost:3000/submission_praktikan"
    },
    {
      title: "Penilaian",
      icon: <Award className="w-5 h-5" />,
      url: "http://localhost:3000/penilaian"
    }
  ];

  return (
    <header className="w-full bg-[#0267FE] shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="h-16 px-8 flex items-center">
        <div className="w-full flex justify-between items-center">
          <div className="w-1/4"></div> {/* Spacer kiri */}
          <nav className="flex-1 flex justify-center space-x-6">
            {menuItems.map((item) => ( // 'item' is now typed as MenuItem
              <a
                key={item.url} // Using item.url or item.title for a more stable key
                href={item.url}
                className="flex items-center space-x-2 text-white hover:text-[#FFFF77] transition-colors duration-200 group"
              >
                <div className="group-hover:text-[#FFFF77]">{item.icon}</div>
                <span className="font-medium">{item.title}</span>
              </a>
            ))}
          </nav>
          <div className="w-1/4 flex justify-end items-center space-x-3">
            <span className="text-white font-medium">John Doe</span>
            <Avatar className="h-10 w-10">
              {/* Assuming you want an image here, like in the previous example. */}
              {/* If no image is available, the AvatarFallback will be shown if the image fails to load or isn't provided. */}
              <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
              <AvatarFallback className="bg-gray-200 text-gray-600">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;