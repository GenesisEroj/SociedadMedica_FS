import Divider from './Divider.jsx'
export default function About() {
  return (
    <section className="page-section bg-primary text-white mb-0" id="about">
      <div className="container">
        <h2 className="page-section-heading text-center text-uppercase text-white">Acerca de mi</h2>
        <Divider light />
        <div className="row">
          <div className="col-lg-4 ms-auto"><p className="lead">
            Soy Otorrinolaringólogo, especialista en rinoplastía y septoplastía en Santiago de Chile, 
            con más de 700 pacientes atendidos en los últimos dos años. Cursé medicina en la Universidad Centroccidental 
            Lisandro Alvarado (Venezuela, Estado Lara), donde obtuve el título de Médico Cirujano en 2012. Posteriormente, 
            realicé la especialización en Otorrinolaringología, culminada a finales de 2017 en la misma institución. 
            Mi formación se complementó con una subespecialización en Rinología y Cirugía Plástica Facial en el Instituto de 
            Otorrinolaringología y Oftalmología de San Bernardino, Caracas, hasta diciembre de 2019.
          </p></div>
          <div className="col-lg-4 me-auto"><p className="lead">
            Junto a mi equipo, nos enfocamos en esculpir narices armónicas y acordes a los rasgos faciales de cada paciente, 
            considerando siempre sus expectativas y acompañándolos antes, durante y después de la cirugía. 
            Nuestro objetivo es mejorar la estética sin descuidar la funcionalidad, utilizando técnicas y equipos de vanguardia, 
            lo que nos permite alcanzar resultados de narices hermosas, saludables y plenamente funcionales.
          </p></div>
        </div>
      </div>
    </section>
  );
}
