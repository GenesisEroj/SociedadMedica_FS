export default function Divider({ light=false }) {
  const theme = light ? "divider-light" : "";
  return (
    <div className={`divider-custom ${theme}`}>
      <div className="divider-custom-line"></div>
      <div className="divider-custom-icon"><i className="fas fa-star"></i></div>
      <div className="divider-custom-line"></div>
    </div>
  );
}
