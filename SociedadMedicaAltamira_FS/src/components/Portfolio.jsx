import Divider from './Divider.jsx'
export default function Portfolio() {
  const items = [
  {
    "img": "/assets/img/portfolio/1.jpg",
    "title": "1"
  },
  {
    "img": "/assets/img/portfolio/2.jpg",
    "title": "2"
  },
  {
    "img": "/assets/img/portfolio/3.jpg",
    "title": "3"
  },
  {
    "img": "/assets/img/portfolio/4.jpg",
    "title": "4"
  },
  {
    "img": "/assets/img/portfolio/5.jpg",
    "title": "5"
  }
]
  return (
    <section className="page-section portfolio" id="portfolio">
      <div className="container">
        <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0 colorh2">Galeria</h2>
        <Divider />
        <div className="row justify-content-center">
          {items.map((it, idx) => (
            <div className="col-md-6 col-lg-4 mb-5" key={idx}>
              <a className="portfolio-item d-block mx-auto" href={it.img} target="_blank" rel="noreferrer">
                <div className="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
                  <div className="portfolio-item-caption-content text-center text-white"><i className="fas fa-plus fa-3x"></i></div>
                </div>
                <img className="img-fluid" src={it.img} alt={it.title} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
