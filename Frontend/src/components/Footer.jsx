const Footer = () => {
  return (
    <footer
      className="bg-white text-gray-700 text-center py-4"
      style={{ boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.08)" }}
    >
      <p className="text-sm md:text-base font-medium">
        © {new Date().getFullYear()} BuckBit. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;