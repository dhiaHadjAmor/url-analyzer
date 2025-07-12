const Footer = () => {
  return (
    <footer
      className="mt-10 py-4 text-center text-sm text-gray-500 border-t"
      data-testid="footer"
    >
      &copy; {new Date().getFullYear()} Sykell Take-home Challenge | Dhia Haj
      Amor
    </footer>
  );
};

export default Footer;
