export default function Footer() {
  return (
    <footer className="footer text-center">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-5 mb-lg-0">
            <h4 className="text-uppercase mb-4">Ubicacion</h4>
            <p className="lead mb-0">Santiago, Chile</p>
          </div>
          <div className="col-lg-4 mb-5 mb-lg-0">
            <h4 className="text-uppercase mb-4">Redes Sociales</h4>
            <a className="btn btn-outline-light btn-social mx-1" href="#!"><i className="fab fa-fw fa-facebook-f"></i></a>
            <a className="btn btn-outline-light btn-social mx-1" href="#!"><i className="fab fa-fw fa-twitter"></i></a>
            <a className="btn btn-outline-light btn-social mx-1" href="#!"><i className="fab fa-fw fa-linkedin-in"></i></a>
          </div>
          <div className="col-lg-4">
            <h4 className="text-uppercase mb-4">Direccion</h4>
            <p className="lead mb-0">Av Los Leones 440, Oficina 801</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
