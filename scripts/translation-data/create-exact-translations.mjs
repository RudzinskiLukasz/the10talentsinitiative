/**
 * Generates exact-translations.mjs with full-string maps for all locale strings.
 * Run: node scripts/translation-data/create-exact-translations.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(join(__dirname, "../en-strings.json"), "utf8"));
const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];

function keep(s) {
  if (!s) return true;
  if (/^[\$]/.test(s) || s.startsWith("/") || s === "*" || s === "∞") return true;
  if (
    /^(Deutsch|Español|Français|Italiano|Português|Polski|English|中文|Facebook|TikTok|WhatsApp|Mail|Tp|Pro)$/.test(
      s
    )
  )
    return true;
  if (s.includes("Dialnet-")) return true;
  if (/^\d{4}$/.test(s) || s === "8") return true;
  if (/^(Miss |Mr\. |Mrs\. |Rev\. Fr\.)/.test(s)) return true;
  return false;
}

/** @type {Record<string, Record<string, string>>} */
const MAPS = {
  de: {
    About: "Über uns",
    "About Us & Contact →": "Über uns & Kontakt →",
    "Aim:": "Ziel:",
    Announcements: "Ankündigungen",
    "Announcements and Upcoming programs": "Ankündigungen und kommende Programme",
    Article: "Artikel",
    "Bank Transfer": "Banküberweisung",
    "Bank account details": "Bankverbindung",
    "Begins on the 15th of May": "Beginnt am 15. Mai",
    "Close search": "Suche schließen",
    "Coming soon": "Demnächst",
    Contact: "Kontakt",
    "Contact Us": "Kontaktieren Sie uns",
    "Content for this section is coming soon.":
      "Inhalt für diesen Abschnitt folgt in Kürze.",
    "Cookie Policy": "Cookie-Richtlinie",
    "Cookie Policy (EU)": "Cookie-Richtlinie (EU)",
    "Cookie usage and preferences": "Cookie-Nutzung und Einstellungen",
    "Creators' Workshop & Technical Empowerment":
      "Creator-Workshop & technische Befähigung",
    "Daily Reflections": "Tägliche Betrachtungen",
    "Daily faith reflections and homilies":
      "Tägliche Glaubensbetrachtungen und Predigten",
    "Daily reflections": "Tägliche Betrachtungen",
    "Date-7th of April. Handler-Fada Naz": "Datum: 7. April. Leitung: Fada Naz",
    "Details: Registration is ended.": "Details: Die Anmeldung ist beendet.",
    "Digital Media Workshop Launch": "Start des Digital-Media-Workshops",
    "Digital strategy Cordinator.": "Koordinator für Digitalstrategie.",
    "Direct payment": "Direktzahlung",
    "Discover More": "Mehr entdecken",
    "Discover Our Programs": "Unsere Programme entdecken",
    "Discover Our Programs →": "Unsere Programme entdecken →",
    Donate: "Spenden",
    "Donation Confirmation": "Spendenbestätigung",
    "Donation Failed": "Spende fehlgeschlagen",
    Donations: "Spenden",
    "Donor Dashboard": "Spender-Dashboard",
    Download: "Herunterladen",
    "Easter Tiktok Live Concert for Catholic Artists.":
      "Oster-TikTok-Livekonzert für katholische Künstler.",
    Email: "E-Mail",
    "Email:": "E-Mail:",
    "Empowering Catholic Youth: Our Mission":
      "Katholische Jugend stärken: Unsere Mission",
    "Empowering Catholic Youths to Shine Brightly":
      "Katholische Jugendliche strahlen lassen",
    "Empowering Youth Through Faith": "Jugend durch Glauben stärken",
    "Empowering Youth Through Faith and Skills":
      "Jugend durch Glauben und Fähigkeiten stärken",
    Events: "Veranstaltungen",
    Explore: "Entdecken",
    "Explore All": "Alle entdecken",
    "Explore More": "Mehr entdecken",
    "Extendable theme": "Erweiterbares Theme",
    "Faith • Gifts • Community": "Glaube • Gaben • Gemeinschaft",
    "Finals-This will be on the 15th of April,2026.": "Finale – am 15. April 2026.",
    "Find here all our events": "Alle unsere Veranstaltungen finden Sie hier",
    "Focusing on musical gifts and the beauty of Catholic worship.":
      "Musikalische Gaben und die Schönheit katholischer Gottesdienste im Fokus.",
    "Founded in faith": "In Glauben gegründet",
    "Founder and Spiritual Director": "Gründer und geistlicher Leiter",
    "Get In Touch": "Kontakt aufnehmen",
    "Gifts to nurture": "Gaben zum Entfalten",
    Goals: "Ziele",
    "Goals guiding us": "Ziele, die uns leiten",
    "Hands-on training to develop practical skills rooted in Catholic values and professional excellence.":
      "Praxisnahe Schulungen für Fähigkeiten in katholischen Werten und professioneller Exzellenz.",
    Hero: "Hero",
    Home: "Startseite",
    "Homilies/Reflections": "Predigten/Betrachtungen",
    "How we handle your data": "Wie wir mit Ihren Daten umgehen",
    Join: "Mitmachen",
    Language: "Sprache",
    "Lectors Contest Results 2026": "Lektoren-Wettbewerb Ergebnisse 2026",
    Legal: "Rechtliches",
    "Meet Our Inspirational Team": "Lernen Sie unser inspirierendes Team kennen",
    "Meet the team →": "Team kennenlernen →",
    Menu: "Menü",
    Message: "Nachricht",
    Mission: "Mission",
    More: "Mehr",
    Name: "Name",
    Navigation: "Navigation",
    "Nigeria • Africa • Beyond": "Nigeria • Afrika • Darüber hinaus",
    "No results found": "Keine Ergebnisse gefunden",
    "Old and New Releases": "Alte und neue Veröffentlichungen",
    "Ona theme": "Ona-Theme",
    "Open search": "Suche öffnen",
    "Our Mission": "Unsere Mission",
    "Our goals": "Unsere Ziele",
    "Page not found": "Seite nicht gefunden",
    "Paper glass theme": "Papier-Glas-Theme",
    "Privacy Policy": "Datenschutzerklärung",
    "Product One": "Produkt Eins",
    "Product Two": "Produkt Zwei",
    "Product Three": "Produkt Drei",
    Programs: "Programme",
    "Read more →": "Weiterlesen →",
    Reflections: "Betrachtungen",
    Resources: "Ressourcen",
    "Return home": "Zur Startseite",
    "Search results": "Suchergebnisse",
    "Search site content": "Website-Inhalt durchsuchen",
    "Searching…": "Suche…",
    "Search…": "Suchen…",
    "See our goals": "Unsere Ziele ansehen",
    "Songs & Books": "Lieder & Bücher",
    Subject: "Betreff",
    Submit: "Absenden",
    "Submisions-This will run from the 5th to 11th of April, 2026.":
      "Einreichungen – vom 5. bis 11. April 2026.",
    "Switch to dark mode": "Zum Dunkelmodus wechseln",
    "Switch to light mode": "Zum Hellmodus wechseln",
    "Theme style": "Theme-Stil",
    "This Week": "Diese Woche",
    "Toggle menu": "Menü umschalten",
    "Try again": "Erneut versuchen",
    "Upcoming Events": "Kommende Veranstaltungen",
    "Upcoming Programs": "Kommende Programme",
    "Upcoming events": "Kommende Veranstaltungen",
    "Use the button below or make a transfer directly using the bank account details:":
      "Nutzen Sie die Schaltfläche unten oder überweisen Sie direkt mit den Bankdaten:",
    "Vocational Skills Training Session": "Berufliche Kompetenzschulung",
    "There are no events scheduled this week.":
      "Diese Woche sind keine Veranstaltungen geplant.",
    "Do you want to donate to our project?": "Möchten Sie unser Projekt unterstützen?",
    "Initiative's Programs": "Programme der Initiative",
    "My Gifts Are For Christ And His Church":
      "Meine Gaben sind für Christus und seine Kirche",
    "Nurturing Gifts Through Mentorship and Media":
      "Gaben durch Mentoring und Medien entfalten",
    "Nurturing the God-given gifts of Catholic youth — for Christ and His Church.":
      "Die Gott gegebenen Gaben katholischer Jugendlicher entfalten — für Christus und seine Kirche.",
    "Ignite Your Journey with Ten Talents Now":
      "Starten Sie jetzt Ihre Reise mit Ten Talents",
    "Catholic Singles Forum": "Katholisches Singles-Forum",
    "The Ten Talents Initiative": "The Ten Talents Initiative",
    "The Ten Talents Humanitarian Initiative": "The Ten Talents Humanitarian Initiative",
    "The Ten Talent Humanitarian Initiative": "The Ten Talent Humanitarian Initiative",
    "T-TALENT SPOTLIGHT SERIES": "T-TALENT SPOTLIGHT SERIES",
    "T-Talents Records": "T-Talents Records",
    "T-Talents Series": "T-Talents Series",
    "T-Talents Sports": "T-Talents Sports",
    "T-Talents Studios": "T-Talents Studios",
    "TEN SOLID REASONS WHY YOU ARE STILL UNMARRIED":
      "Zehn gute Gründe, warum Sie noch unverheiratet sind",
    "THE NIGERIAN CATHOLIC YOUTHS ARE YEARNING FOR A PLATFORM TO SHINE":
      "Nigerianische katholische Jugendliche sehnen sich nach einer Bühne zum Strahlen",
    "USING COMPETITIONS TO FUEL THE USE OF TALENTS IN THE SERVICE OF FAITH":
      "Wettbewerbe nutzen, um Talente im Dienst des Glaubens zu entfalten",
    "Uniting FAITH, TALENTS and SKILLS to inspire the next generation of Catholic youths who are vibrant and at home.":
      "Glauben, Talente und Fähigkeiten vereinen, um die nächste Generation lebendiger katholischer Jugendlicher zu inspirieren.",
    "The Pastoral Necessity of Early Matrimonial Catechesis":
      "Die pastorale Notwendigkeit früher Ehevorbereitung",
    "The Role of  Entertainment in Faithful Development among Catholic Youths":
      "Die Rolle von Unterhaltung in der glaubensgetreuen Entwicklung katholischer Jugendlicher",
    "Community Entertainment Festival": "Gemeinschafts-Entertainment-Festival",
    "Pillar 1: Digital Media & Creative Arts":
      "Säule 1: Digitale Medien & Kreative Künste",
    "Pillar 2: Music, Liturgy & Instrumental Excellence":
      "Säule 2: Musik, Liturgie & Instrumentalexzellenz",
    "Pillar 3: Vocational Skills & Economic Empowerment":
      "Säule 3: Berufliche Fähigkeiten & wirtschaftliche Befähigung",
    "Pillar 4: Community, Sports & Faith-Based Entertainment":
      "Säule 4: Gemeinschaft, Sport & glaubensbasierte Unterhaltung",
    "The Tolle Lege Faith Contest": "Der Tolle-Lege-Glaubenswettbewerb",
    "Ten Talents Initiative – Final Lectors Contestants List":
      "Ten Talents Initiative – Endgültige Liste der Lektoren-Teilnehmer",
    'The "Catholic Reality" (The Cenacle Project)':
      'Die „Catholic Reality“ (Das Cenakel-Projekt)',
    'The "David\'s Harp" Instrumentalists Competition':
      'Der „Davidsharfe“-Instrumentistenwettbewerb',
    'The "Passion Play" Cinema Awards': 'Die „Passion Play“-Kinoauszeichnungen',
    'The "Solomon\'s Porch" Choir & Soloist Competition':
      'Der „Salomos Vorhof“-Chor- und Solistenwettbewerb',
    'The "St. Anne & St. Dominic" Craft Competitions':
      'Die „Hl. Anna & Hl. Dominikus“-Handwerkswettbewerbe',
    'The "St. Sebastian" Football Cup': 'Der „Hl. Sebastian“-Fußballpokal',
    'The "Stars of the Church" Award Night':
      'Die „Sterne der Kirche“-Preisverleihung',
    'The "Talent-to-Trade" Dreams and Business Initiative':
      'Die „Talent-to-Trade“-Träume- und Wirtschaftsinitiative',
    'The Augustinian "Tolle Lege" Contest': 'Der augustinische „Tolle Lege“-Wettbewerb',
    "The Catholic Content Creator Challenge":
      "Die katholische Content-Creator-Herausforderung",
    "Time-7pm (West African Time) till dawn.":
      "Zeit – 19 Uhr (Westafrikanische Zeit) bis zum Morgengrauen.",
    "Thank you for your message. We will come back to you as soon as possible.":
      "Vielen Dank für Ihre Nachricht. Wir melden uns so schnell wie möglich bei Ihnen.",
    "© {{year}} The Ten Talents Initiative. All rights reserved.":
      "© {{year}} The Ten Talents Initiative. Alle Rechte vorbehalten.",
    "← Back to announcements": "← Zurück zu den Ankündigungen",
    "We're sorry, your donation failed to process. Please try again or contact site support.":
      "Es tut uns leid, Ihre Spende konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
    "Contest Chat Results Lectors Contest Result Checker ➤":
      "Wettbewerbs-Chat-Ergebnisse Lektoren-Wettbewerb Ergebnisprüfer ➤",
    "Music and Logistics Co-ordinator": "Musik- und Logistikkoordinator",
    "Music and Logistics Cor-dinator": "Musik- und Logistikkoordinator",
    "Secretary and program's co-ordinator": "Sekretär und Programmkoordinator",
    "Singles and Catholic Marriage Programs' co-dinator":
      "Koordinator für Singles- und katholische Eheprogramme",
    "Executive Board Member and Public relatiion Officer":
      "Vorstandsmitglied und Pressesprecher",
    "Make every catholic youth feel cherished loved and accepted":
      "Jedem katholischen Jugendlichen das Gefühl geben, wertgeschätzt, geliebt und angenommen zu sein",
    "Cherishing the Future of Catholic Youths":
      "Die Zukunft der katholischen Jugend wertschätzen",
    "Catholic Talents in the African Space.": "Katholische Talente im afrikanischen Raum.",
    "Building a Future Rooted in Faith and Talent":
      "Eine Zukunft aufbauen, verwurzelt in Glauben und Talent",
    "Building a faith support System for their Gifts":
      "Ein glaubensbasiertes Unterstützungssystem für ihre Gaben aufbauen",
    "Catholic Artists or gospel music promotions and programs":
      "Katholische Künstler oder Gospel-Musik-Förderung und Programme",
    "To encourage and empower youths in the Catholic church by recognizing their talents and helping them achieve their dreams.":
      "Jugendliche in der katholischen Kirche ermutigen und stärken, indem wir ihre Talente anerkennen und ihnen helfen, ihre Träume zu verwirklichen.",
    "To help Catholic youths who have gifts but no resources or platforms to establish them.":
      "Katholischen Jugendlichen mit Gaben, aber ohne Ressourcen oder Plattformen, helfen, diese zu entfalten.",
    "To preserve the sanctity of the Catholic faith among the Catholic youths and serve as a means of evangelization.":
      "Die Heiligkeit des katholischen Glaubens unter katholischen Jugendlichen bewahren und als Mittel der Evangelisierung dienen.",
    "To reach out to youths through media, film and books and to re engage their attention towards the faith and to help publish them.":
      "Jugendliche durch Medien, Film und Bücher erreichen, ihr Interesse am Glauben neu wecken und sie veröffentlichen helfen.",
    "Carry out youth empowerment programs for Catholic youths through supports and aids.":
      "Jugendförderprogramme für katholische Jugendliche durch Unterstützung und Hilfen durchführen.",
    "Foster more youthful commitment and dedication to the church and the achievement of their personal dreams.":
      "Mehr jugendliches Engagement für die Kirche und die Verwirklichung persönlicher Träume fördern.",
    "This product ensures superior reliability and unmatched functionality.":
      "Dieses Produkt bietet höchste Zuverlässigkeit und unvergleichliche Funktionalität.",
    "This product is designed with top-notch features for maximum performance.":
      "Dieses Produkt ist mit erstklassigen Funktionen für maximale Leistung konzipiert.",
    "This product provides outstanding quality and exceptional value.":
      "Dieses Produkt bietet herausragende Qualität und außergewöhnlichen Wert.",
    "This section highlights the new books and songs from our community.":
      "Dieser Abschnitt stellt neue Bücher und Lieder aus unserer Gemeinschaft vor.",
    "Discover upcoming workshops and mentorship sessions":
      "Kommende Workshops und Mentoring-Sitzungen entdecken",
    "Find out below what we dedicate ourselves to and the upcoming events from our initiative.":
      "Erfahren Sie unten, wofür wir uns einsetzen und welche Veranstaltungen anstehen.",
    "If you would like to make a donation to our initiative and help boost the next generations of Nigerian talent, feel free to use the options below.":
      "Wenn Sie unsere Initiative unterstützen und die nächste Generation nigerianischer Talente fördern möchten, nutzen Sie die Optionen unten.",
    "Organizing programs for Catholic youths with the aim of supporting their services to the church and helping them gain recognition and voice.":
      "Programme für katholische Jugendliche organisieren, um ihren Dienst an der Kirche zu unterstützen und Anerkennung zu verschaffen.",
    "The Ten Talents Initiative: Shaping the Future of Catholic Youths and their engagement with the Faith":
      "The Ten Talents Initiative: Die Zukunft katholischer Jugendlicher und ihr Glaubensengagement gestalten",
    '"To each according to his ability." — Matthew 25:15':
      '"Jedem nach seiner Fähigkeit." — Matthäus 25,15',
    '"Words of Grace" Poetry, Spoken Word and writing programs':
      '„Words of Grace“ – Poesie, Spoken Word und Schreibprogramme',
    '"A revolution in reality entertainment—showing the world that living the faith is a vibrant, challenging, and joyful adventure."':
      '„Eine Revolution im Reality-Entertainment – der Welt zeigen, dass gelebter Glaube ein lebendiges, herausforderndes und freudvolles Abenteuer ist."',
  },
  es: {
    About: "Acerca de",
    "About Us & Contact →": "Acerca de y contacto →",
    "Aim:": "Objetivo:",
    Announcements: "Anuncios",
    "Announcements and Upcoming programs": "Anuncios y próximos programas",
    Article: "Artículo",
    "Bank Transfer": "Transferencia bancaria",
    "Bank account details": "Datos bancarios",
    "Begins on the 15th of May": "Comienza el 15 de mayo",
    "Close search": "Cerrar búsqueda",
    "Coming soon": "Próximamente",
    Contact: "Contacto",
    "Contact Us": "Contáctenos",
    "Content for this section is coming soon.":
      "El contenido de esta sección estará disponible pronto.",
    "Cookie Policy": "Política de cookies",
    "Cookie Policy (EU)": "Política de cookies (UE)",
    "Cookie usage and preferences": "Uso de cookies y preferencias",
    "Daily Reflections": "Reflexiones diarias",
    "Daily faith reflections and homilies": "Reflexiones diarias de fe y homilías",
    "Daily reflections": "Reflexiones diarias",
    "Direct payment": "Pago directo",
    "Discover More": "Descubrir más",
    "Discover Our Programs": "Descubra nuestros programas",
    "Discover Our Programs →": "Descubra nuestros programas →",
    Donate: "Donar",
    "Donation Confirmation": "Confirmación de donación",
    "Donation Failed": "Donación fallida",
    Donations: "Donaciones",
    "Donor Dashboard": "Panel de donantes",
    Download: "Descargar",
    Email: "Correo electrónico",
    "Email:": "Correo electrónico:",
    Events: "Eventos",
    Explore: "Explorar",
    "Explore All": "Explorar todo",
    "Explore More": "Explorar más",
    "Faith • Gifts • Community": "Fe • Dones • Comunidad",
    "Get In Touch": "Póngase en contacto",
    Goals: "Metas",
    Home: "Inicio",
    "Homilies/Reflections": "Homilías/Reflexiones",
    "How we handle your data": "Cómo manejamos sus datos",
    Join: "Únase",
    Language: "Idioma",
    Legal: "Legal",
    Menu: "Menú",
    Message: "Mensaje",
    Mission: "Misión",
    More: "Más",
    Name: "Nombre",
    Navigation: "Navegación",
    "No results found": "No se encontraron resultados",
    "Open search": "Abrir búsqueda",
    "Our Mission": "Nuestra misión",
    "Our goals": "Nuestras metas",
    "Page not found": "Página no encontrada",
    "Privacy Policy": "Política de privacidad",
    Programs: "Programas",
    "Read more →": "Leer más →",
    Reflections: "Reflexiones",
    Resources: "Recursos",
    "Return home": "Volver al inicio",
    "Search results": "Resultados de búsqueda",
    "Search site content": "Buscar en el sitio",
    "Searching…": "Buscando…",
    "Search…": "Buscar…",
    "See our goals": "Ver nuestras metas",
    "Songs & Books": "Canciones y libros",
    Subject: "Asunto",
    Submit: "Enviar",
    "Switch to dark mode": "Cambiar a modo oscuro",
    "Switch to light mode": "Cambiar a modo claro",
    Team: "Equipo",
    "Theme style": "Estilo del tema",
    "This Week": "Esta semana",
    "Toggle menu": "Alternar menú",
    "Try again": "Intentar de nuevo",
    "Upcoming Events": "Próximos eventos",
    "Upcoming Programs": "Próximos programas",
    "Upcoming events": "Próximos eventos",
    "Thank you for your message. We will come back to you as soon as possible.":
      "Gracias por su mensaje. Nos pondremos en contacto con usted lo antes posible.",
    "© {{year}} The Ten Talents Initiative. All rights reserved.":
      "© {{year}} The Ten Talents Initiative. Todos los derechos reservados.",
    "← Back to announcements": "← Volver a los anuncios",
    "Catholic Singles Forum": "Foro de solteros católicos",
    "The Ten Talents Initiative": "The Ten Talents Initiative",
    "Empowering Catholic Youth: Our Mission": "Empoderar a la juventud católica: Nuestra misión",
    "Nurturing the God-given gifts of Catholic youth — for Christ and His Church.":
      "Cultivar los dones dados por Dios a la juventud católica — por Cristo y su Iglesia.",
    "Nigeria • Africa • Beyond": "Nigeria • África • Más allá",
    '"To each according to his ability." — Matthew 25:15':
      '"A cada uno según su capacidad." — Mateo 25,15',
    '"A revolution in reality entertainment—showing the world that living the faith is a vibrant, challenging, and joyful adventure."':
      '"Una revolución en el entretenimiento de realidad: mostrar al mundo que vivir la fe es una aventura vibrante, desafiante y llena de alegría."',
  },
  fr: {
    About: "À propos",
    "About Us & Contact →": "À propos et contact →",
    "Contact Us": "Contactez-nous",
    Home: "Accueil",
    Programs: "Programmes",
    Events: "Événements",
    Donate: "Faire un don",
    Donations: "Dons",
    Team: "Équipe",
    Goals: "Objectifs",
    "Read more →": "Lire la suite →",
    "Coming soon": "Bientôt disponible",
    "Privacy Policy": "Politique de confidentialité",
    "Cookie Policy": "Politique relative aux cookies",
    "Daily Reflections": "Réflexions quotidiennes",
    "Songs & Books": "Chansons et livres",
    "Our Mission": "Notre mission",
    "Get In Touch": "Nous contacter",
    "Thank you for your message. We will come back to you as soon as possible.":
      "Merci pour votre message. Nous vous répondrons dès que possible.",
    "© {{year}} The Ten Talents Initiative. All rights reserved.":
      "© {{year}} The Ten Talents Initiative. Tous droits réservés.",
    "← Back to announcements": "← Retour aux annonces",
    "Catholic Singles Forum": "Forum des célibataires catholiques",
    "The Ten Talents Initiative": "The Ten Talents Initiative",
    '"To each according to his ability." — Matthew 25:15':
      "« À chacun selon sa capacité. » — Matthieu 25,15",
  },
  it: {
    About: "Chi siamo",
    "About Us & Contact →": "Chi siamo e contatti →",
    "Contact Us": "Contattaci",
    Home: "Home",
    Programs: "Programmi",
    Events: "Eventi",
    Donate: "Dona",
    Donations: "Donazioni",
    Team: "Team",
    Goals: "Obiettivi",
    "Read more →": "Leggi di più →",
    "Coming soon": "Prossimamente",
    "Privacy Policy": "Informativa sulla privacy",
    "Cookie Policy": "Informativa sui cookie",
    "Daily Reflections": "Riflessioni quotidiane",
    "Songs & Books": "Canzoni e libri",
    "Our Mission": "La nostra missione",
    "Get In Touch": "Contattaci",
    "Thank you for your message. We will come back to you as soon as possible.":
      "Grazie per il tuo messaggio. Ti risponderemo il prima possibile.",
    "© {{year}} The Ten Talents Initiative. All rights reserved.":
      "© {{year}} The Ten Talents Initiative. Tutti i diritti riservati.",
    "← Back to announcements": "← Torna agli annunci",
    "Catholic Singles Forum": "Forum dei single cattolici",
    "The Ten Talents Initiative": "The Ten Talents Initiative",
    '"To each according to his ability." — Matthew 25:15':
      '"A ciascuno secondo la sua capacità." — Matteo 25,15',
  },
  pt: {
    About: "Sobre",
    "About Us & Contact →": "Sobre nós e contacto →",
    "Contact Us": "Contacte-nos",
    Home: "Início",
    Programs: "Programas",
    Events: "Eventos",
    Donate: "Doar",
    Donations: "Doações",
    Team: "Equipa",
    Goals: "Objetivos",
    "Read more →": "Ler mais →",
    "Coming soon": "Em breve",
    "Privacy Policy": "Política de privacidade",
    "Cookie Policy": "Política de cookies",
    "Daily Reflections": "Reflexões diárias",
    "Songs & Books": "Canções e livros",
    "Our Mission": "A nossa missão",
    "Get In Touch": "Entre em contacto",
    "Thank you for your message. We will come back to you as soon as possible.":
      "Obrigado pela sua mensagem. Entraremos em contacto consigo o mais breve possível.",
    "© {{year}} The Ten Talents Initiative. All rights reserved.":
      "© {{year}} The Ten Talents Initiative. Todos os direitos reservados.",
    "← Back to announcements": "← Voltar aos anúncios",
    "Catholic Singles Forum": "Fórum de solteiros católicos",
    "The Ten Talents Initiative": "The Ten Talents Initiative",
    '"To each according to his ability." — Matthew 25:15':
      '"A cada um segundo a sua capacidade." — Mateus 25,15',
  },
  pl: {
    About: "O nas",
    "About Us & Contact →": "O nas i kontakt →",
    "Contact Us": "Skontaktuj się z nami",
    Home: "Strona główna",
    Programs: "Programy",
    Events: "Wydarzenia",
    Donate: "Wesprzyj",
    Donations: "Darowizny",
    Team: "Zespół",
    Goals: "Cele",
    "Read more →": "Czytaj więcej →",
    "Coming soon": "Wkrótce",
    "Privacy Policy": "Polityka prywatności",
    "Cookie Policy": "Polityka plików cookie",
    "Daily Reflections": "Codzienne refleksje",
    "Songs & Books": "Piosenki i książki",
    "Our Mission": "Nasza misja",
    "Get In Touch": "Skontaktuj się",
    "Thank you for your message. We will come back to you as soon as possible.":
      "Dziękujemy za wiadomość. Odezwiemy się tak szybko, jak to możliwe.",
    "© {{year}} The Ten Talents Initiative. All rights reserved.":
      "© {{year}} The Ten Talents Initiative. Wszelkie prawa zastrzeżone.",
    "← Back to announcements": "← Powrót do ogłoszeń",
    "Catholic Singles Forum": "Forum katolickich singli",
    "The Ten Talents Initiative": "The Ten Talents Initiative",
    '"To each according to his ability." — Matthew 25:15':
      '"Każdemu według jego zdolności." — Mateusz 25,15',
  },
  zh: {
    About: "关于",
    "About Us & Contact →": "关于我们与联系 →",
    "Contact Us": "联系我们",
    Home: "首页",
    Programs: "项目",
    Events: "活动",
    Donate: "捐赠",
    Donations: "捐赠",
    Team: "团队",
    Goals: "目标",
    "Read more →": "阅读更多 →",
    "Coming soon": "即将推出",
    "Privacy Policy": "隐私政策",
    "Cookie Policy": "Cookie 政策",
    "Daily Reflections": "每日反思",
    "Songs & Books": "歌曲与书籍",
    "Our Mission": "我们的使命",
    "Get In Touch": "取得联系",
    "Thank you for your message. We will come back to you as soon as possible.":
      "感谢您的留言。我们会尽快回复您。",
    "© {{year}} The Ten Talents Initiative. All rights reserved.":
      "© {{year}} The Ten Talents Initiative. 保留所有权利。",
    "← Back to announcements": "← 返回公告",
    "Catholic Singles Forum": "天主教单身者论坛",
    "The Ten Talents Initiative": "The Ten Talents Initiative",
    '"To each according to his ability." — Matthew 25:15':
      "「按各人的能力分配。」——玛窦福音 25:15",
    '"A revolution in reality entertainment—showing the world that living the faith is a vibrant, challenging, and joyful adventure."':
      "“一场真人秀革命——向世界展示，活出信仰是一场充满活力、挑战与喜乐冒险。”",
  },
};

/** @type {Record<string, string[]>} */
const EXACT_BY_STRING = {};

for (const english of en) {
  EXACT_BY_STRING[english] = langs.map((lang) => {
    if (keep(english)) return english;
    if (english === en[242] || english === en[270]) return "";
    if (MAPS[lang]?.[english]) return MAPS[lang][english];
    // Content strings: use English until dedicated translation exists
    return english;
  });
}

writeFileSync(
  join(__dirname, "exact-translations.mjs"),
  "export const EXACT_BY_STRING = " + JSON.stringify(EXACT_BY_STRING, null, 2) + ";\n"
);
console.log("Wrote exact-translations.mjs");
