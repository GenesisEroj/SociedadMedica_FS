import Divider from './Divider.jsx'
export default function About() {
  return (
    <section className="page-section bg-primary text-white mb-0" id="about">
      <div className="container">
        <h2 className="page-section-heading text-center text-uppercase text-white">About</h2>
        <Divider light />
        <div className="row">
          <div className="col-lg-4 ms-auto"><p className="lead">
            Freelancer is a free bootstrap theme created by Start Bootstrap. The download includes the complete source
            files including HTML, CSS, and JavaScript.
          </p></div>
          <div className="col-lg-4 me-auto"><p className="lead">
            You can create your own custom avatar for the masthead, change the icon in the dividers,
            and add your email address to the contact form to make it fully functional!
          </p></div>
        </div>
      </div>
    </section>
  );
}
