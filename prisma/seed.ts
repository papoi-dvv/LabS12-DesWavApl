import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = `${process.env.DATABASE_URL}`.replace('?pgbouncer=true&connection_limit=1', '')

if (!connectionString || !connectionString.includes('postgresql')) {
  throw new Error(`Invalid DATABASE_URL: ${connectionString}`)
}

console.log(`Conectando a base de datos...`)

const pool = new Pool({
  connectionString,
  max: 1,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 30000,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
  log: ['error'],
})

interface BookData {
  title: string
  description: string
  isbn?: string
  publishedYear: number
  genre: string
  pages: number
}

interface AuthorWithBooks {
  name: string
  email: string
  nationality: string
  birthYear: number
  bio: string
  books: BookData[]
}

const authorsWithBooks: AuthorWithBooks[] = [
  {
    name: 'Miguel de Cervantes',
    email: 'cervantes@universal.com',
    nationality: 'España',
    birthYear: 1547,
    bio: 'Máxima figura de la literatura española, creador de la novela moderna.',
    books: [
      {
        title: 'Don Quijote de la Mancha',
        description: 'La historia del ingenioso hidalgo que perdió el juicio por leer libros de caballerías.',
        isbn: '978-8420412146',
        publishedYear: 1605,
        genre: 'Novela',
        pages: 1056,
      },
      {
        title: 'La Galatea',
        description: 'Novela pastoril que cuenta las aventuras amorosas de varios pastores.',
        isbn: '978-8437605555',
        publishedYear: 1585,
        genre: 'Romance',
        pages: 456,
      },
      {
        title: 'Novelas ejemplares',
        description: 'Colección de doce novelas cortas que ejemplifican virtudes y defectos humanos.',
        isbn: '978-8420435281',
        publishedYear: 1613,
        genre: 'Cuento',
        pages: 652,
      },
    ],
  },
  {
    name: 'William Shakespeare',
    email: 'shakespeare@universal.com',
    nationality: 'Reino Unido',
    birthYear: 1564,
    bio: 'El dramaturgo más importante de la historia, maestro de las tragedias humanas.',
    books: [
      {
        title: 'Hamlet',
        description: 'Tragedia familiar y política donde el príncipe de Dinamarca busca vengar la muerte de su padre.',
        isbn: '978-0451526922',
        publishedYear: 1603,
        genre: 'Tragedia',
        pages: 342,
      },
      {
        title: 'Romeo y Julieta',
        description: 'La tragedia de dos jóvenes amantes cuyo amor es prohibido por sus familias rivales.',
        isbn: '978-0451526939',
        publishedYear: 1595,
        genre: 'Tragedia',
        pages: 256,
      },
      {
        title: 'Macbeth',
        description: 'Una tragedia sobre la ambición y el poder que corrompe a un guerrero escocés.',
        isbn: '978-0451526960',
        publishedYear: 1606,
        genre: 'Tragedia',
        pages: 208,
      },
    ],
  },
  {
    name: 'Edgar Allan Poe',
    email: 'poe@universal.com',
    nationality: 'Estados Unidos',
    birthYear: 1809,
    bio: 'Maestro del terror de la narrativa gótica y pionero del relato detectivesco.',
    books: [
      {
        title: 'Los crímenes de la calle Morgue',
        description: 'Considerado el primer relato de detectives de la historia literaria.',
        isbn: '978-1503222625',
        publishedYear: 1841,
        genre: 'Misterio',
        pages: 96,
      },
      {
        title: 'El gato negro',
        description: 'Relato terrorífico sobre obsesión, culpa y castigo sobrenatural.',
        isbn: '978-1495395061',
        publishedYear: 1843,
        genre: 'Terror',
        pages: 48,
      },
      {
        title: 'La caída de la casa Usher',
        description: 'Un viajero visita a su amigo enfermo en una mansión maldita y decadente.',
        isbn: '978-1503381841',
        publishedYear: 1839,
        genre: 'Terror',
        pages: 64,
      },
    ],
  },
  {
    name: 'Fyodor Dostoevsky',
    email: 'dostoevsky@universal.com',
    nationality: 'Rusia',
    birthYear: 1821,
    bio: 'Explorador profundo de la psicología humana y el existencialismo decimonónico.',
    books: [
      {
        title: 'Crimen y castigo',
        description: 'Análisis psicológico de Rodión Raskólnikov tras cometer un asesinato por dilemas morales.',
        isbn: '978-0140449136',
        publishedYear: 1866,
        genre: 'Novela',
        pages: 672,
      },
      {
        title: 'Los hermanos Karamazov',
        description: 'Epopeya familiar que explora fe, duda y responsabilidad moral en la Rusia zarista.',
        isbn: '978-0374528553',
        publishedYear: 1879,
        genre: 'Novela',
        pages: 796,
      },
      {
        title: 'El idiota',
        description: 'Historia de un príncipe moralmente puro que choca con una sociedad corrupta.',
        isbn: '978-0374526610',
        publishedYear: 1869,
        genre: 'Novela',
        pages: 688,
      },
    ],
  },
  {
    name: 'Mary Shelley',
    email: 'shelley@universal.com',
    nationality: 'Reino Unido',
    birthYear: 1797,
    bio: 'Escritora y filósofa, pionera indiscutible de la ciencia ficción moderna.',
    books: [
      {
        title: 'Frankenstein o el moderno Prometeo',
        description: 'Un científico desafía los límites de la naturaleza dando vida a una criatura hecha de cadáveres.',
        isbn: '978-0141439471',
        publishedYear: 1818,
        genre: 'Ciencia Ficción',
        pages: 280,
      },
      {
        title: 'El último hombre',
        description: 'Novela distópica sobre la última persona viva en una Tierra devastada por peste.',
        isbn: '978-0199555314',
        publishedYear: 1826,
        genre: 'Ciencia Ficción',
        pages: 624,
      },
      {
        title: 'Mathilda',
        description: 'Novela corta sobre una joven mujer atrapada en un triángulo amoroso incestuoso.',
        isbn: '978-1557425546',
        publishedYear: 1959,
        genre: 'Romance',
        pages: 144,
      },
    ],
  },
  {
    name: 'George Orwell',
    email: 'orwell@universal.com',
    nationality: 'Reino Unido',
    birthYear: 1903,
    bio: 'Cronista de la cultura y la política, famoso por sus mordaces críticas al totalitarismo.',
    books: [
      {
        title: '1984',
        description: 'Novela distópica sobre un régimen totalitario omnipresente liderado por el Gran Hermano.',
        isbn: '978-0451524935',
        publishedYear: 1949,
        genre: 'Distopía',
        pages: 328,
      },
      {
        title: 'Rebelión en la granja',
        description: 'Alegoría satírica sobre la Revolución Rusa y el surgimiento del estalinismo.',
        isbn: '978-0451526342',
        publishedYear: 1945,
        genre: 'Sátira',
        pages: 112,
      },
      {
        title: 'La revolución de los animales',
        description: 'Secuela no oficial que continúa la historia de la granja bajo nuevo régimen.',
        isbn: '978-0393080230',
        publishedYear: 1974,
        genre: 'Novela',
        pages: 192,
      },
    ],
  },
  {
    name: 'Franz Kafka',
    email: 'kafka@universal.com',
    nationality: 'República Checa',
    birthYear: 1883,
    bio: 'Escritor cuyas obras abordan el absurdo, la burocracia opresiva y la alienación.',
    books: [
      {
        title: 'La metamorfosis',
        description: 'Gregorio Samsa se despierta una mañana transformado en un monstruoso insecto.',
        isbn: '978-1503252417',
        publishedYear: 1915,
        genre: 'Ficción Absurda',
        pages: 96,
      },
      {
        title: 'El proceso',
        description: 'Un hombre arrestado por cargos desconocidos se ve atrapado en un sistema judicial absurdo.',
        isbn: '978-0805210254',
        publishedYear: 1925,
        genre: 'Novela',
        pages: 272,
      },
      {
        title: 'El castillo',
        description: 'Un agrimensor intenta acceder a un castillo misterioso controlado por autoridades opacas.',
        isbn: '978-0805210285',
        publishedYear: 1926,
        genre: 'Novela',
        pages: 352,
      },
    ],
  },
  {
    name: 'Jorge Luis Borges',
    email: 'borges@universal.com',
    nationality: 'Argentina',
    birthYear: 1899,
    bio: 'Figura clave de la literatura en español del siglo XX, conocido por sus cuentos filosóficos.',
    books: [
      {
        title: 'Ficciones',
        description: 'Antología de cuentos que juegan con laberintos, espejos, infinitos y bibliotecas irreales.',
        isbn: '978-0307950925',
        publishedYear: 1944,
        genre: 'Fantasía Filosófica',
        pages: 224,
      },
      {
        title: 'El Aleph',
        description: 'Colección de relatos que exploran la metafísica, el tiempo y la realidad alternativa.',
        isbn: '978-0307950932',
        publishedYear: 1949,
        genre: 'Fantasía Filosófica',
        pages: 194,
      },
      {
        title: 'La muerte y la brújula',
        description: 'Detective de misterio e impecable razonamiento deductivo en Buenos Aires.',
        isbn: '978-0140430332',
        publishedYear: 1942,
        genre: 'Misterio',
        pages: 184,
      },
    ],
  },
  {
    name: 'Jane Austen',
    email: 'austen@universal.com',
    nationality: 'Reino Unido',
    birthYear: 1775,
    bio: 'Novelista británica cuyas obras critican con ironía la sociedad de clases de su época.',
    books: [
      {
        title: 'Orgullo y prejuicio',
        description: 'Una brillante comedia romántica clásica sobre las apariencias y las clases sociales.',
        isbn: '978-0141439518',
        publishedYear: 1813,
        genre: 'Romance',
        pages: 432,
      },
      {
        title: 'Sentido y sensibilidad',
        description: 'Historia de dos hermanas con temperamentos opuestos que buscan amor y aceptación.',
        isbn: '978-0141040721',
        publishedYear: 1811,
        genre: 'Romance',
        pages: 368,
      },
      {
        title: 'Emma',
        description: 'Historia de una joven adinerada que intriga en las vidas amorosas de sus amigas.',
        isbn: '978-0141439587',
        publishedYear: 1815,
        genre: 'Romance',
        pages: 474,
      },
    ],
  },
  {
    name: 'Julio Verne',
    email: 'verne@universal.com',
    nationality: 'Francia',
    birthYear: 1828,
    bio: 'Cofundador de la ciencia ficción, famoso por sus visionarias novelas de aventuras.',
    books: [
      {
        title: 'Veinte mil leguas de viaje submarino',
        description: 'Aventuras mar adentro a bordo del submarino Nautilus guiado por el Capitán Nemo.',
        isbn: '978-0140390629',
        publishedYear: 1870,
        genre: 'Aventura',
        pages: 448,
      },
      {
        title: 'Viaje al centro de la Tierra',
        description: 'Expedición épica hacia el interior de la Tierra descubriendo un mundo perdido.',
        isbn: '978-0140431025',
        publishedYear: 1864,
        genre: 'Aventura',
        pages: 352,
      },
      {
        title: 'La vuelta al mundo en 80 días',
        description: 'Una emocionante carrera alrededor del mundo contra reloj.',
        isbn: '978-0140361673',
        publishedYear: 1873,
        genre: 'Aventura',
        pages: 304,
      },
    ],
  },
  {
    name: 'Antoine de Saint-Exupéry',
    email: 'exupery@universal.com',
    nationality: 'Francia',
    birthYear: 1900,
    bio: 'Aviador e ilustrador francés, creador de una de las obras más traducidas del mundo.',
    books: [
      {
        title: 'El principito',
        description: 'Una fábula poética y filosófica que examina la vida de los adultos desde los ojos de un niño espacial.',
        isbn: '978-0156012195',
        publishedYear: 1943,
        genre: 'Fábula',
        pages: 96,
      },
      {
        title: 'Tierra de hombres',
        description: 'Memorias de vuelo que reflexionan sobre la fraternidad humana y el sentido de la vida.',
        isbn: '978-0156027069',
        publishedYear: 1939,
        genre: 'Memorias',
        pages: 272,
      },
      {
        title: 'El Principito (Ilustrado)',
        description: 'Edición ilustrada del clásico infantil con dibujos del propio autor.',
        isbn: '978-0156012208',
        publishedYear: 1943,
        genre: 'Infantil',
        pages: 104,
      },
    ],
  },
  {
    name: 'Virginia Woolf',
    email: 'woolf@universal.com',
    nationality: 'Reino Unido',
    birthYear: 1882,
    bio: 'Figura destacada del modernismo literario vanguardista y del feminismo internacional.',
    books: [
      {
        title: 'Al faro',
        description: 'Obra cumbre del flujo de conciencia que retrata la vida de la familia Ramsay.',
        isbn: '978-0156907385',
        publishedYear: 1927,
        genre: 'Modernismo',
        pages: 209,
      },
      {
        title: 'Una habitación propia',
        description: 'Ensayo revolucionario sobre la independencia económica e intelectual de las mujeres escritoras.',
        isbn: '978-0156907346',
        publishedYear: 1929,
        genre: 'Ensayo',
        pages: 112,
      },
      {
        title: 'Orlando',
        description: 'Novela fantástica sobre un noble que atraviesa siglos y cambia de género.',
        isbn: '978-0156701006',
        publishedYear: 1928,
        genre: 'Fantasía',
        pages: 336,
      },
    ],
  },
  {
    name: 'Ernest Hemingway',
    email: 'hemingway@universal.com',
    nationality: 'Estados Unidos',
    birthYear: 1899,
    bio: 'Premio Nobel de Literatura 1954, caracterizado por su estilo directo y minimalista.',
    books: [
      {
        title: 'El viejo y el mar',
        description: 'La lucha heroica y solitaria de un viejo pescador cubano contra un enorme pez espada marlín.',
        isbn: '978-0684801223',
        publishedYear: 1952,
        genre: 'Novela Corta',
        pages: 128,
      },
      {
        title: 'Por quién doblan las campanas',
        description: 'Novela sobre la Guerra Civil Española y un explosivista americano en una misión peligrosa.',
        isbn: '978-0684803357',
        publishedYear: 1940,
        genre: 'Novela',
        pages: 528,
      },
      {
        title: 'Las nieves del Kilimanjaro',
        description: 'Cuento sobre un escritor moribundo que reflexiona sobre su vida mientras asciende a la montaña.',
        isbn: '978-0743219425',
        publishedYear: 1938,
        genre: 'Cuento',
        pages: 56,
      },
    ],
  },
  {
    name: 'Oscar Wilde',
    email: 'wilde@universal.com',
    nationality: 'Irlanda',
    birthYear: 1854,
    bio: 'Escritor y poeta conocido por su ingenio punzante, sus obras teatrales y su estética lírica.',
    books: [
      {
        title: 'El retrato de Dorian Gray',
        description: 'Un joven vende su alma para que su retrato envejezca y sufra los pecados en su lugar.',
        isbn: '978-0141439570',
        publishedYear: 1890,
        genre: 'Gótico',
        pages: 304,
      },
      {
        title: 'La importancia de llamarse Ernesto',
        description: 'Comedia satírica que ridiculiza las convenciones sociales victorianas con ingenio brillante.',
        isbn: '978-0486264784',
        publishedYear: 1895,
        genre: 'Comedia',
        pages: 96,
      },
      {
        title: 'El fantasma de Canterville',
        description: 'Historia cómica sobre un fantasma inglés que intenta asustar a una familia americana.',
        isbn: '978-1481290289',
        publishedYear: 1887,
        genre: 'Humor',
        pages: 104,
      },
    ],
  },
  {
    name: 'J.R.R. Tolkien',
    email: 'tolkien@universal.com',
    nationality: 'Reino Unido',
    birthYear: 1892,
    bio: 'Filólogo y académico, considerado el padre de la alta fantasía épica moderna.',
    books: [
      {
        title: 'El Hobbit',
        description: 'El tranquilo hobbit Bilbo Bolsón es arrastrado a una peligrosa aventura para recuperar un tesoro custodiado por un dragón.',
        isbn: '978-0345339683',
        publishedYear: 1937,
        genre: 'Fantasía',
        pages: 310,
      },
      {
        title: 'El Señor de los Anillos: La Comunidad del Anillo',
        description: 'Comienza la épica aventura para destruir el Anillo Único y derrotar a Sauron.',
        isbn: '978-0544003415',
        publishedYear: 1954,
        genre: 'Fantasía',
        pages: 423,
      },
      {
        title: 'El Silmarillion',
        description: 'Mitología de la Tierra Media que cuenta la creación del mundo y sus primeras edades.',
        isbn: '978-0544003422',
        publishedYear: 1977,
        genre: 'Fantasía',
        pages: 365,
      },
    ],
  },
  {
    name: 'Homero',
    email: 'homero@universal.com',
    nationality: 'Grecia',
    birthYear: -800,
    bio: 'Antiguo poeta épico griego, pilar fundamental del canon literario occidental.',
    books: [
      {
        title: 'La Odisea',
        description: 'El accidentado e increíble viaje de regreso a casa del héroe Odiseo tras la caída de Troya.',
        isbn: '978-0140268866',
        publishedYear: -750,
        genre: 'Epopeya',
        pages: 544,
      },
      {
        title: 'La Ilíada',
        description: 'Épica de la Guerra de Troya que narra la batalla entre griegos y troyanos durante diez años.',
        isbn: '978-0140275031',
        publishedYear: -750,
        genre: 'Epopeya',
        pages: 683,
      },
      {
        title: 'Himno Homérico',
        description: 'Colección de 33 himnos cortos dedicados a los dioses del Olimpo de la mitología griega.',
        isbn: '978-0199537419',
        publishedYear: -700,
        genre: 'Poesía',
        pages: 224,
      },
    ],
  },
  {
    name: 'Agatha Christie',
    email: 'christie@universal.com',
    nationality: 'Reino Unido',
    birthYear: 1890,
    bio: 'La reina del misterio, creadora de los detectives Hércules Poirot y Miss Marple.',
    books: [
      {
        title: 'Asesinato en el Orient Express',
        description: 'Un detective debe resolver un sangriento asesinato ocurrido a bordo de un tren varado en la nieve.',
        isbn: '978-0062073501',
        publishedYear: 1934,
        genre: 'Policial',
        pages: 256,
      },
      {
        title: 'Y no quedó ninguno',
        description: 'Diez extraños son convocados a una isla donde son acusados de crímenes sin resolver.',
        isbn: '978-0062693662',
        publishedYear: 1939,
        genre: 'Policial',
        pages: 272,
      },
      {
        title: 'Muerte en el Nilo',
        description: 'Asesinato a bordo de un crucero en el río Nilo durante una luna de miel.',
        isbn: '978-0062073525',
        publishedYear: 1937,
        genre: 'Policial',
        pages: 288,
      },
    ],
  },
  {
    name: 'Dante Alighieri',
    email: 'dante@universal.com',
    nationality: 'Italia',
    birthYear: 1265,
    bio: 'El "Poeta Supremo", autor que consolidó la transición entre la Edad Media y el Renacimiento.',
    books: [
      {
        title: 'La Divina Comedia',
        description: 'Un viaje teológico a través del Infierno, el Purgatorio y el Paraíso.',
        isbn: '978-0140448955',
        publishedYear: 1320,
        genre: 'Poesía Épica',
        pages: 752,
      },
      {
        title: 'La Vita Nuova',
        description: 'Autobiografía poética que mezcla prosa y poesía en la historia de su amor por Beatriz.',
        isbn: '978-0140442298',
        publishedYear: 1295,
        genre: 'Poesía',
        pages: 144,
      },
      {
        title: 'Convivio',
        description: 'Tratado filosófico donde Dante comenta sus propias canciones alegóricas.',
        isbn: '978-0199555628',
        publishedYear: 1307,
        genre: 'Filosofía',
        pages: 328,
      },
    ],
  },
  {
    name: 'H.P. Lovecraft',
    email: 'lovecraft@universal.com',
    nationality: 'Estados Unidos',
    birthYear: 1890,
    bio: 'Innovador del cuento de terror, creador de la corriente del horror cósmico.',
    books: [
      {
        title: 'La llamada de Cthulhu',
        description: 'Relato que establece el despertar de entidades alienígenas ancestrales ocultas en la Tierra.',
        isbn: '978-1515434115',
        publishedYear: 1928,
        genre: 'Terror Cósmico',
        pages: 45,
      },
      {
        title: 'La casa de la Bruja',
        description: 'Un hombre investigador explora una casa maldita llena de secretos sobrenaturales.',
        isbn: '978-1505236231',
        publishedYear: 1924,
        genre: 'Terror',
        pages: 56,
      },
      {
        title: 'En las montañas de la locura',
        description: 'Expedición antártica descubre civilización alienígena y secretos cósmicos prohibidos.',
        isbn: '978-1515434153',
        publishedYear: 1936,
        genre: 'Ciencia Ficción',
        pages: 108,
      },
    ],
  },
  {
    name: 'Mario Vargas Llosa',
    email: 'vargasllosa@universal.com',
    nationality: 'Perú',
    birthYear: 1936,
    bio: 'Premio Nobel de Literatura 2010, uno de los más grandes novelistas del Boom Latinoamericano.',
    books: [
      {
        title: 'La ciudad y los perros',
        description: 'Novela que relata las duras vivencias de los jóvenes cadetes en el Colegio Militar Leoncio Prado.',
        isbn: '978-0307474742',
        publishedYear: 1963,
        genre: 'Novela',
        pages: 464,
      },
      {
        title: 'La Casa Verde',
        description: 'Novela multilineal ambientada en la jungla peruana que entrelaза varias historias trágicas.',
        isbn: '978-0307474759',
        publishedYear: 1966,
        genre: 'Novela',
        pages: 412,
      },
      {
        title: 'Pantaleón y las visitadoras',
        description: 'Sátira militar sobre un oficial que organiza un servicio de prostitutas para la guarnición amazónica.',
        isbn: '978-0061567742',
        publishedYear: 1973,
        genre: 'Sátira',
        pages: 380,
      },
    ],
  },
]

async function seed() {
  try {
    console.log('🌱 Iniciando seeding de la base de datos...')

    // Nota: NO limpiamos la BD para evitar timeouts. 
    // Si necesitas limpiar manualmente, ejecuta:
    // npx prisma db execute --stdin < 'DELETE FROM "Book"; DELETE FROM "Author";'

    // Insertar autores y sus libros con upsert para ser resiliente
    for (const authorData of authorsWithBooks) {
      console.log(`➕ Procesando autor: ${authorData.name}`)

      const author = await prisma.author.upsert({
        where: { email: authorData.email },
        update: {},
        create: {
          name: authorData.name,
          email: authorData.email,
          nationality: authorData.nationality,
          birthYear: authorData.birthYear,
          bio: authorData.bio,
        },
      })

      console.log(`   📚 Agregando ${authorData.books.length} libros...`)

      for (const bookData of authorData.books) {
        // Si hay ISBN, usamos upsert por unicidad; si no, creamos normalmente.
        if (bookData.isbn) {
          await prisma.book.upsert({
            where: { isbn: bookData.isbn },
            update: {},
            create: {
              title: bookData.title,
              description: bookData.description,
              isbn: bookData.isbn,
              publishedYear: bookData.publishedYear,
              genre: bookData.genre,
              pages: bookData.pages,
              authorId: author.id,
            },
          })
        } else {
          await prisma.book.create({
            data: {
              title: bookData.title,
              description: bookData.description,
              publishedYear: bookData.publishedYear,
              genre: bookData.genre,
              pages: bookData.pages,
              authorId: author.id,
            },
          })
        }
      }

      console.log(`   ✅ ${authorData.name} completado`)
    }

    // Obtener estadísticas finales
    const authorCount = await prisma.author.count()
    const bookCount = await prisma.book.count()

    console.log('✨ Seeding completado exitosamente')
    console.log(`📊 Total de autores en BD: ${authorCount}`)
    console.log(`📚 Total de libros en BD: ${bookCount}`)
  } catch (error) {
    console.error('❌ Error durante el seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
