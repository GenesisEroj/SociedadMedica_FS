import Divider from './Divider.jsx'
export default function Header() {
  return (
    <header className="masthead bg-primary text-white text-center">
      <div className="container d-flex align-items-center flex-column">
        <img className="masthead-avatar mb-5" src="/assets/img/dra-maria-rojas-banner.jpg" alt="avatar" />
        <h1 className="masthead-heading text-uppercase mb-0">Dra Maria Jesus Rojas</h1>
        <Divider light />
        <p className="masthead-subheading font-weight-light mb-0">Rinología y Cirugía Plástica Facial</p>
      </div>
    </header>
  );
}
