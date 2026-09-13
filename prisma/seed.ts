import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "../generated/prisma/client.js";
import { saveImage } from "../lib/storage.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const STATEMENT_EN = [
  "North Carolina's social, cultural, and economic life is deeply intertwined with the contributions of the Hispanic community, both immigrant and native-born. Yet the state's institutions and social structures continue to organize policies and resources around a racial binary that excludes those who don't fit the paradigm — treating the fastest-growing population in the state as a problem to be solved, at times with hostility or apathy, rather than as a partner invested in the state's long-term success.",
  "Sin Pedir Permiso explores the many ways the Hispanic community takes up space. The collection reveals the tension Hispanics in North Carolina experience in expressing Latinidad — the complexities and contradictions of race, color, legal status, language, and the politics of place. Through the gaze of photojournalist Walter Gómez, the exhibition examines the community's relationship with the social structures we all depend on. The photographs were taken over a ten-year period beginning in 2017, while Gómez covered the day's events for Enlace Latino NC — the first nonprofit, Spanish-language, digital-native newsroom in North Carolina, founded and led by immigrant journalists committed to serving the state's Latino and Hispanic communities.",
  "This collection treats the Hispanic community as the protagonist of its own story, rather than the object of debate. It examines the risks and benefits of taking up space, the costs and rewards of cultural expression and visibility, and the experience of engaging with systems concerned with protecting the status quo. The photographs range in theme from events that evoke joy and pride to experiences of hostility and injustice. The exhibition is curated to assert that Hispanics in North Carolina are as entitled to the state's institutions and social structures as any other community — declaring the community's right to North Carolina itself, sin pedir permiso: without asking permission.",
];

const STATEMENT_ES = [
  "La vida social, cultural y económica de Carolina del Norte está profundamente entrelazada con las contribuciones de la comunidad hispana, tanto inmigrante como nacida en el país. Sin embargo, las instituciones y estructuras sociales del estado continúan organizando políticas y recursos en torno a un binario racial que excluye a quienes no encajan en ese paradigma, tratando a la población de más rápido crecimiento del estado como un problema por resolver —a veces con hostilidad o apatía— en lugar de como un socio comprometido con el éxito a largo plazo del estado.",
  "Sin Pedir Permiso explora las diversas formas en que la comunidad hispana ocupa espacio. La colección revela la tensión que experimentan los hispanos en Carolina del Norte al expresar su latinidad: las complejidades y contradicciones de raza, color, estatus legal, idioma y las dinámicas políticas del territorio. A través de la mirada del fotoperiodista Walter Gómez, la exposición examina la relación de la comunidad con las estructuras sociales de las que todos dependemos. Las fotografías fueron tomadas a lo largo de un período de diez años, a partir de 2016, mientras Gómez cubría los acontecimientos del día para Enlace Latino NC, la primera sala de redacción nativa digital, sin fines de lucro y en español de Carolina del Norte, fundada y dirigida por periodistas inmigrantes comprometidos con servir a las comunidades latinas e hispanas del estado.",
  "Esta colección trata a la comunidad hispana como la protagonista de su propia historia, en lugar de como el objeto de un debate. Examina los riesgos y beneficios de ocupar espacio, los costos y recompensas de la expresión cultural y la visibilidad, y la experiencia de relacionarse con sistemas enfocados en proteger el statu quo. Las fotografías abarcan temas que van desde eventos que evocan alegría y orgullo hasta experiencias de hostilidad e injusticia. La exposición está curada para afirmar que los hispanos en Carolina del Norte tienen tanto derecho a las instituciones y estructuras sociales del estado como cualquier otra comunidad, declarando el derecho de la comunidad a la propia Carolina del Norte, sin pedir permiso.",
];

const SEED_PHOTOS = [
  { file: "photo-02-parade-dresses.jpg", titleEn: "Aftermath", titleEs: "Después de la tormenta",
    descEn: "A man crouches inside the collapsed steel frame of what was, until recently, a home or workplace. Insulation, roofing, and a pickup truck lie scattered behind him among the pines. His posture is still, almost contemplative, in a landscape where nothing else is standing straight. Storms do not distinguish by who is affected, but recovery does — access to insurance, savings, legal status, and language all shape how quickly a family can rebuild. This image sits with that gap between the disaster itself and the uneven work of putting a life back together afterward.",
    descEs: "Un hombre se agacha dentro de la estructura de acero colapsada de lo que, hasta hace poco, fue un hogar o un lugar de trabajo. Aislante, láminas de techo y una camioneta yacen dispersos detrás de él entre los pinos. Su postura es quieta, casi contemplativa, en un paisaje donde nada más queda en pie. Las tormentas no distinguen a quién afectan, pero la recuperación sí — el acceso a seguros, ahorros, estatus legal e idioma determinan qué tan rápido una familia puede reconstruir su vida. Esta imagen se detiene en esa brecha entre el desastre mismo y el trabajo desigual de reconstruir una vida después." },
  { file: "photo-01-tornado.jpg", titleEn: "Fiestas Patrias", titleEs: "Fiestas Patrias",
    descEn: "Two performers stand for a portrait in hand-embroidered Mexican dress, floral patterns in full color against a backdrop of trees and parade crowds. Their poses are confident and deliberate, claiming the frame rather than waiting to be looked at. Fiestas Patrias celebrations bring traditional dress, dance, and pageantry into public space in North Carolina towns where that visibility is not always assumed to belong. The image reads as both a celebration of heritage and, in this context, a quiet assertion of the right to take up that space without apology.",
    descEs: "Dos artistas posan para un retrato con vestidos mexicanos bordados a mano, con patrones florales en colores vivos frente a un fondo de árboles y multitudes de un desfile. Sus poses son seguras y deliberadas, reclamando el encuadre en lugar de esperar a ser observadas. Las celebraciones de Fiestas Patrias llevan el vestido tradicional, el baile y la pompa al espacio público en ciudades de Carolina del Norte donde esa visibilidad no siempre se asume como propia. La imagen se lee tanto como una celebración de la herencia como, en este contexto, una afirmación silenciosa del derecho a ocupar ese espacio sin pedir disculpas." },
  { file: "photo-08-street.jpg", titleEn: "Graduation Day", titleEs: "Día de graduación",
    descEn: "Three graduates in caps and gowns walk toward the camera, diplomas in hand, laughing mid-stride outside a North Carolina building. Cords and medals across their gowns mark academic distinctions earned over years of work. Behind them, classmates and family follow at their own pace. Commencement is one of the few moments where a community's investment in the next generation becomes visible all at once — a milestone that belongs equally to the graduates and to the families and communities who helped get them there.",
    descEs: "Tres graduadas con togas y birretes caminan hacia la cámara, diplomas en mano, riendo a media zancada frente a un edificio de Carolina del Norte. Cordones y medallas sobre sus togas marcan distinciones académicas obtenidas tras años de esfuerzo. Detrás de ellas, compañeros y familiares las siguen a su propio ritmo. La graduación es uno de los pocos momentos en que la inversión de una comunidad en la siguiente generación se vuelve visible de golpe — un logro que pertenece tanto a las graduadas como a las familias y comunidades que las ayudaron a llegar ahí." },
  { file: "photo-07-macaw.jpg", titleEn: "Procession", titleEs: "Procesión",
    descEn: "A man carries a statue of Our Lady of Guadalupe, gold rays fanning out around her, through a crowd gathered on a winter day. Beside him, a woman holds a young child close, her expression steady and unhurried despite the press of people around them. Processions like this move faith out of the church building and into streets, parking lots, and neighborhoods — a public, physical act of devotion that is also, inevitably, a public act of presence.",
    descEs: "Un hombre carga una imagen de la Virgen de Guadalupe, con rayos dorados extendiéndose a su alrededor, entre una multitud reunida en un día de invierno. A su lado, una mujer sostiene cerca a una niña pequeña, con una expresión serena y sin prisa a pesar de la gente que los rodea. Procesiones como esta sacan la fe del templo hacia las calles, estacionamientos y vecindarios — un acto de devoción público y físico que también es, inevitablemente, un acto público de presencia." },
  { file: "photo-06-harvest.jpg", titleEn: "In Memory", titleEs: "En memoria",
    descEn: "A man in sunglasses holds a handwritten sign reading \"In Loving Memory of Gabby\" beside a tree strung with pink ribbons, balloons, and photographs. His expression is guarded, giving little away. Memorials like this one turn a public tree into a shared site of grief, built from whatever a community has on hand — construction paper, foil balloons, taped-up photos — rather than anything formal. Grief made visible in public space is its own kind of claim: that a loss here matters enough to be marked where everyone can see it.",
    descEs: "Un hombre con lentes de sol sostiene un letrero escrito a mano que dice \"In Loving Memory of Gabby\" junto a un árbol adornado con cintas rosadas, globos y fotografías. Su expresión es reservada, sin revelar mucho. Memoriales como este convierten un árbol público en un sitio compartido de duelo, hecho con lo que una comunidad tiene a la mano — papel de cartulina, globos de aluminio, fotos pegadas con cinta — en lugar de algo formal. El duelo hecho visible en el espacio público es, en sí mismo, una forma de afirmar que una pérdida aquí importa lo suficiente para señalarla donde todos puedan verla." },
  { file: "photo-05-memorial.jpg", titleEn: "Harvest", titleEs: "Cosecha",
    descEn: "A woman in a wide-brimmed hat holds an armful of freshly cut greens, smiling directly at the camera against rows of crops and a wooded tree line. The plants are still damp with morning and slightly wild-looking, more like a small farm plot than an industrial field. Agricultural work is one of the most consistent threads running through Hispanic life in North Carolina, and one of the least visible — this portrait puts a face, a smile, and a specific harvest in front of a labor that is usually described only in statistics.",
    descEs: "Una mujer con sombrero de ala ancha sostiene un manojo de verduras recién cortadas, sonriendo directamente a la cámara frente a hileras de cultivos y una línea de árboles. Las plantas todavía están húmedas por la mañana y se ven algo silvestres, más parecidas a una pequeña parcela que a un campo industrial. El trabajo agrícola es uno de los hilos más constantes en la vida hispana en Carolina del Norte, y uno de los menos visibles — este retrato pone un rostro, una sonrisa y una cosecha específica frente a una labor que usualmente solo se describe en estadísticas." },
  { file: "photo-04-guadalupe.jpg", titleEn: "Fiestas Patrias Parade", titleEs: "Desfile de las Fiestas Patrias",
    descEn: "A girl in a red costume with feathered macaw wings spread wide performs down a parade route, other dancers in red and blue behind her. The wings are handmade, layered from cut felt or foam in red, yellow, and blue — hours of work built for a single afternoon in the street. Parades like this turn ordinary intersections and parking lots into stages, briefly and deliberately, for a display of culture that does not otherwise get civic space set aside for it.",
    descEs: "Una niña con un traje rojo y alas emplumadas de guacamaya extendidas se presenta a lo largo de una ruta de desfile, con otras bailarinas en rojo y azul detrás de ella. Las alas están hechas a mano, en capas de fieltro o espuma cortada en rojo, amarillo y azul — horas de trabajo construidas para una sola tarde en la calle. Desfiles como este convierten intersecciones y estacionamientos comunes en escenarios, de forma breve y deliberada, para una muestra cultural que de otro modo no cuenta con un espacio cívico reservado para ella." },
  { file: "photo-03-graduation.jpg", titleEn: "Daily Life", titleEs: "Vida cotidiana",
    descEn: "A mother adjusts a car seat carrier while her young son walks ahead of her down a quiet residential street, mobile homes and parked cars on either side. Nothing about the moment is staged — it is the ordinary logistics of getting kids from one place to another on an errand that will be forgotten by evening. Most of the exhibition's subjects are pictured at events; this one is not, and that ordinariness is its own kind of statement: daily life, unremarkable and unwatched, is also where a community lives.",
    descEs: "Una madre acomoda un portabebés mientras su hijo pequeño camina delante de ella por una calle residencial tranquila, con casas móviles y autos estacionados a los lados. Nada en el momento está preparado — es la logística ordinaria de llevar a los niños de un lugar a otro en un mandado que se olvidará al anochecer. La mayoría de los sujetos de la exposición aparecen en eventos; este no lo es, y esa cotidianidad es en sí misma una declaración: la vida diaria, sin nada extraordinario y sin ser observada, es también donde vive una comunidad." },
  { file: "photo-10-portrait.jpg", titleEn: "Young Dancer", titleEs: "Joven danzante",
    descEn: "A young boy looks straight into the camera, his face marked with red and green paint and topped with a fur-and-feather headdress trimmed in red and green plumes. A drum sits just behind him on the grass. Children are often dressed first in traditions like this one, learning the weight and meaning of the regalia years before they understand all of what it represents. His gaze here is steady, neither performing for the camera nor shy of it.",
    descEs: "Un niño mira directamente a la cámara, con el rostro pintado en rojo y verde y un tocado de piel y plumas rojas y verdes. Un tambor descansa justo detrás de él sobre el pasto. En tradiciones como esta, a menudo son los niños los primeros en vestirse, aprendiendo el peso y el significado de la vestimenta años antes de comprender todo lo que representa. Su mirada aquí es firme, sin actuar para la cámara ni esquivarla." },
  { file: "photo-09-headdress.jpg", titleEn: "Portrait", titleEs: "Retrato",
    descEn: "A man sits on a small wooden chair in a yard, mid-laugh, hands clasped loosely between his knees. A corrugated metal wall and cinder block foundation fill the background — an unposed, unadorned setting that gives the portrait its ease. Moments like this one, caught in conversation rather than composed for it, are where a lot of documentary photography does its real work: not in the big public events, but in the pause between them.",
    descEs: "Un hombre está sentado en una pequeña silla de madera en un patio, riendo, con las manos entrelazadas entre las rodillas. Una pared de lámina metálica y una base de bloques de concreto llenan el fondo — un entorno sin poses ni adornos que le da naturalidad al retrato. Momentos como este, capturados en plena conversación en lugar de compuestos para ella, son donde gran parte de la fotografía documental hace su verdadero trabajo: no en los grandes eventos públicos, sino en la pausa entre ellos." },
];

const SEED_BIOS = [
  {
    name: "Walter A. Gómez",
    roleEn: "Photojournalist",
    roleEs: "Fotoperiodista",
    bodyEn: "Walter A. Gómez is the co-founder and managing editor of Enlace Latino NC, a social communicator, journalist, and independent photographer. As a photographer, he collaborates with the EFE News Agency, covering the Carolinas and Tennessee. His work has earned more than twenty national journalism awards from the National Association of Hispanic Publications (NAHP). Before joining Enlace Latino NC, Gómez spent nine years at the newspaper La Conexión in Raleigh as a principal reporter and sports editor. He also brings experience from Argentina, where he built community radio stations and newspapers in underserved areas. With over twenty years in journalism and social communication across Argentina and North Carolina, Gómez pairs journalistic credibility with powerful imagery to keep the community informed.",
    bodyEs: "Walter A. Gómez es cofundador y director editorial de Enlace Latino NC, comunicador social, periodista y fotógrafo independiente. Como fotógrafo, colabora con la Agencia de Noticias EFE cubriendo las Carolinas y Tennessee. Su trabajo ha ganado más de veinte premios nacionales de periodismo de la Asociación Nacional de Publicaciones Hispanas (NAHP, por sus siglas en inglés). Antes de unirse a Enlace Latino NC, Gómez trabajó durante nueve años en el periódico La Conexión en Raleigh como reportero principal y editor de deportes. También aporta experiencia de Argentina, donde desarrolló emisoras de radio comunitarias y periódicos en zonas de bajos recursos. Con más de veinte años en periodismo y comunicación social entre Argentina y Carolina del Norte, Gómez combina la credibilidad periodística con imágenes de gran impacto para mantener informada a la comunidad.",
  },
  {
    name: "Erik Valera",
    roleEn: "Artist & Curatorial Collaborator",
    roleEs: "Artista y colaborador curatorial",
    bodyEn: "Erik Valera is an artist and Gómez's curatorial collaborator, leading the project's research, partnering on the selection of the work, and developing its institutional and community foundations. Of Mexican and Cuban heritage and raised within Hispanic-Latino communities, Valera brings three decades of experience in the civic, cultural, and public-health institutions of the community the exhibition portrays. He has served in executive leadership at major North Carolina Latino organizations, including as Chief Operating Officer of El Centro Hispano and Interim Executive Director of the Diamante Arts and Cultural Center; as a Planning Commissioner for the Town of Chapel Hill; and on the North Carolina Governor's Advisory Council on Hispanic/Latino Affairs, where he chaired the committee that produced a statewide language access policy adopted by all of the state's executive cabinet agencies.",
    bodyEs: "Erik Valera es artista y colaborador curatorial de Gómez, liderando la investigación del proyecto, colaborando en la selección de las obras y desarrollando sus bases institucionales y comunitarias. De herencia mexicana y cubana y criado dentro de comunidades hispano-latinas, Valera aporta tres décadas de experiencia en instituciones cívicas, culturales y de salud pública de la comunidad que retrata la exposición. Ha ocupado cargos directivos en importantes organizaciones latinas de Carolina del Norte, incluyendo los de Director de Operaciones de El Centro Hispano y Director Ejecutivo Interino del Centro de Arte y Cultura Diamante; Comisionado de Planificación del Municipio de Chapel Hill; y miembro del Consejo Asesor del Gobernador de Carolina del Norte para Asuntos Hispanos/Latinos, donde presidió el comité que redactó la política estatal de acceso lingüístico adoptada por todas las agencias del gabinete ejecutivo del estado.",
  },
];

async function fileFromDisk(relPath: string) {
  const buf = await readFile(path.join(process.cwd(), relPath));
  return new File([new Uint8Array(buf)], path.basename(relPath));
}

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash },
    });
    console.log(`Admin user ready: ${email}`);
  } else {
    console.warn("ADMIN_EMAIL/ADMIN_PASSWORD not set in .env — skipped admin user seed.");
  }

  await prisma.siteContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      brand: "Sin Pedir Permiso",
      heroSubtitleEn: "Without Asking Permission",
      heroSubtitleEs: "",
      heroCreditEn: "Photographs by Walter Gómez. Curated with Erik Valera.",
      heroCreditEs: "Fotografías de Walter Gómez. Curaduría con Erik Valera.",
      statementEn: STATEMENT_EN.join("\n\n"),
      statementEs: STATEMENT_ES.join("\n\n"),
      footerCreditEn: "Presented in collaboration with Enlace Latino NC",
      footerCreditEs: "Presentado en colaboración con Enlace Latino NC",
    },
  });
  console.log("Site content ready.");

  if ((await prisma.photo.count()) === 0) {
    for (const [i, p] of SEED_PHOTOS.entries()) {
      const file = await fileFromDisk(`assets/${p.file}`);
      const imageUrl = await saveImage(file, "photos");
      await prisma.photo.create({
        data: { order: i, imageUrl, titleEn: p.titleEn, titleEs: p.titleEs, descEn: p.descEn, descEs: p.descEs },
      });
    }
    console.log(`Seeded ${SEED_PHOTOS.length} photos.`);
  } else {
    console.log("Photos already present — skipped photo seed.");
  }

  if ((await prisma.bio.count()) === 0) {
    for (const [i, b] of SEED_BIOS.entries()) {
      await prisma.bio.create({ data: { order: i, ...b } });
    }
    console.log(`Seeded ${SEED_BIOS.length} bios.`);
  } else {
    console.log("Bios already present — skipped bio seed.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
