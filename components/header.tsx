const Header = () => {
  return (
    <div className="flex justify-between items-center font-nunito p-4 bg-white shadow-md">
      <h2 className="text-3xl font-bold">PRAKTIKUM</h2>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
        <span className="text-gray-700 font-medium">Admin1234567</span>
      </div>
    </div>
  );
};

export default Header;
