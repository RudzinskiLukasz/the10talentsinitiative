// Single source of truth for site copy — matched to the10talentsinitiative.com

export const site = {
  name: "The Ten Talents Initiative",
  email: "thetentalentsinitiative@gmail.com",
  contactEmail: "bulusmaina25@gmail.com",
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Daily Reflections", href: "/daily-reflections" },
  { label: "Events", href: "/events" },
  { label: "Songs & Books", href: "/songs-books" },
  { label: "Contact Us", href: "/contact" },
];

export const secondaryNav = [
  { label: "T-Talents Records", href: "/t-talents-records" },
  { label: "T-Talents Studios", href: "/t-talents-studios" },
  { label: "T-Talents Series", href: "/t-talents-series" },
  { label: "T-Talents Sports", href: "/t-talents-sports" },
  { label: "Catholic Singles Forum", href: "/catholic-singles-forum" },
  { label: "Donations", href: "/donations" },
];

/** Combined nav for footer and other link lists */
export const nav = [...mainNav, ...secondaryNav];

export const hero = {
  quote:
    "Do not bury your talents! The gifts that God has given you. Do not be afraid to dream of great things!",
  quoteAttribution:
    "Pope Francis, Address to the Youth of Umbria, Pastoral Visit to Assisi, October 4, 2013",
  title: "My Gifts Are For Christ And His Church",
  description:
    "Founded in 2025 by Rev. Fr. Eze Emmanuel, OSA, and other well-meaning Catholics, The Ten Talents Initiative inspires young believers by nurturing their gifts in faith-driven arts and careers. Through mentorship, media, and skill development, it fosters a deeper commitment to Catholic values and the Christian faith. The initiative focuses on the empowerment of Catholic youth, supporting their spiritual growth and personal fulfillment, including initiatives for girl-child education and marital advocacy. Its primary mission, however, is nurturing the faith of the young by employing their talents in the service of the Church and humanity. This initiative is deeply influenced by Augustinian charism and spirituality, which emphasizes interiority—finding God within and recognizing the gifts He has bestowed upon everyone for His glory. It was the delayed perception of this inner divinity that prompted St. Augustine to exclaim, “Late have I loved you, O Beauty so ancient and so new!”",
  ctaPrimary: "Discover Our Programs",
  ctaPrimaryHref: "/programs",
  ctaSecondary: "Our Mission",
  ctaSecondaryHref: "/contact#mission",
};

export const mission = {
  eyebrow: "Empowering Catholic Youth: Our Mission",
  body: "Our mission is to reach out to Catholic youths in Nigeria, Africa and maybe the world at large and make them feel loved, cherished, encouraged and valued. We intend to extend our care to their personal life goals, dreams and passions, especially those of them who are gifted and passionate about a particular endeavour and to help them achieve those dreams. We also intend to encourage those using their gifts in service of the faith by recognising their efforts through awards and other empowerment programs.",
};

export const teamSection = {
  title: "Meet Our Inspirational Team",
  description:
    "Discover the passionate individuals driving our mission forward with dedication and faith.",
};

export const team = [
  {
    name: "Rev. Fr. Eze Emmanuel OSA",
    role: "Founder and Spiritual Director",
    email: null,
    image: "/images/team/eze-emmanuel.jpg",
  },
  {
    name: "Mr. Bulus Maina",
    role: "Executive Board Member and PRO (Public Relations Officer)",
    email: "bulusmaina25@gmail.com",
    image: "/images/team/bulus-maina.jpg",
  },
  {
    name: "Miss. Chidera G. Okafor.",
    role: "Music and Logistics Coordinator",
    email: "okaforgeraldine50@gmail.com",
    image: "/images/team/chidera-okafor.jpg",
  },
  {
    name: "Mrs. Godson Lilian (Eucyl)",
    role: "Music and Logistics Coordinator",
    email: "eucylily@gmail.com",
    image: "/images/team/godson-lilian.jpg",
  },
  {
    name: "Mr. Luka Yusuf Rumu",
    role: "Digital Strategy Coordinator",
    email: "lukayusufrumu@gmail.com",
    image: "/images/team/luka-rumu.jpg",
  },
  {
    name: "Miss IBE NAOMI TIWA",
    role: "Singles and Catholic Marriage Programs Coordinator",
    email: "franomi788@gmail.com",
    image: "/images/team/ibe-naomi-tiwa.jpeg",
  },
  {
    name: "João Pedro Silva Francisco",
    role: "Advisory Council for Youths Sports mission. Master in Football Business partnership with Barcelona",
    email: null,
    image: "/images/team/joao-pedro-silva-francisco.png",
  },
  {
    name: "Dr. Jan Lachowicz",
    role: "Advisory Council member for Health mission",
    email: null,
    image: "/images/team/jan-lachowicz.png",
  },
  {
    name: "Łukasz Rudziński",
    role: "Advisory Council Member for Software and digital communications Mission",
    email: null,
    image: "/images/team/lukasz-rudzinski.png",
  },
  {
    name: "Yvonne Uyanwune",
    role: "Advisory Council member — Head of Legal Team",
    email: null,
    image: "/images/team/yvonne-uyanwune.png",
  },
  {
    name: "Allison James",
    role: "Advisory Council member — Girl child Welfare and sports mission",
    email: null,
    image: "/images/team/allison-james.png",
  },
];

export const goalsSection = {
  title: "Our goals",
};

export const goals = [
  {
    title: "Empowering Catholic Youths to Shine Brightly",
    points: [
      "To encourage and empower youths in the Catholic church by recognizing their talents and helping them achieve their dreams.",
      "Organizing programs for Catholic youths with the aim of supporting their services to the church and helping them gain recognition and voice.",
    ],
  },
  {
    title: "Building a faith support System for their Gifts",
    points: [
      "Carry out youth empowerment programs for Catholic youths through supports and aids.",
      "Foster more youthful commitment and dedication to the church and the achievement of their personal dreams.",
    ],
  },
  {
    title: "Nurturing Gifts Through Mentorship and Media",
    points: [
      "To reach out to youths through media, film and books and to re engage their attention towards the faith and to help publish them.",
      "To help Catholic youths who have gifts but no resources or platforms to establish them.",
    ],
  },
  {
    title: "Building a Future Rooted in Faith and Talent",
    points: [
      "To preserve the sanctity of the Catholic faith among the Catholic youths and serve as a means of evangelization.",
      "Make every catholic youth feel cherished loved and accepted",
    ],
  },
];

export const join = {
  title: "Ignite Your Journey with Ten Talents Now",
  body: "Join us to discover how your unique gifts can flourish through faith, mentorship, and community support. Embrace the path to growth and spiritual empowerment today.",
  cta: "Discover Our Programs",
  ctaHref: "/programs",
};

export const homePage = {
  hero:
    "Uniting FAITH, TALENTS and SKILLS to inspire the next generation of Catholic youths who are vibrant and at home.",
  discoverMoreHref: "/programs",
  introTitle: "Empowering Youth Through Faith",
  introBody:
    "The Ten Talents initiative is a Non-Profit Organization founded by Rev.Fr. Eze Emmanuel OSA a Catholic Priest of the Order of St. Augustine Province of Nigeria. Together with a group of other well meaning Catholics, this Initiative was founded to help empower and encourage catholic youths who are talented and are giving their time for the sake of the gospel. The Initiative was founded in 2025 and was initially known as the Association of Catholic Artists with the aim of bringing together youths or catholics who are gifted in the arts and encouraging them to use their gifts properly for the service of the faith.",
  announcementsTitle: "Announcements",
  announcementsIntro:
    "Explore our collection of inspiring stories, expert advice, and faith-driven resources designed to empower and engage young talents across Africa.",
  programsTitle: "Empowering Youth Through Faith and Skills",
  programsIntro:
    "Discover upcoming programs and initiatives designed to inspire growth, foster community, and celebrate talent across Nigeria and Africa.",
  programTeasers: [
    {
      title: "Digital Media Workshop Launch",
      date: "",
      venue: "",
      description:
        "Join us as we kick off a transformative workshop on digital storytelling and media skills.",
    },
    {
      title: "Vocational Skills Training Session",
      date: "",
      venue: "",
      description:
        "Hands-on training to develop practical skills rooted in Catholic values and professional excellence.",
    },
    {
      title: "Community Entertainment Festival",
      date: "",
      venue: "",
      description:
        "A vibrant celebration blending music, culture, and faith to uplift and unite youth.",
    },
  ],
  donateTitle: "Do you want to donate to our project?",
  donateBody:
    "Use the button below or make a transfer directly using the bank account details:",
  donateCta: "Donate",
  bankDetails: "THE TEN TALENT HUMANITARIAN INITIATIVE",
};

export const programsPage = {
  title: "Initiative's Programs",
  intro:
    "Find out below what we dedicate ourselves to and the upcoming events from our initiative.",
  pillars: [
    {
      name: "Pillar 1: Digital Media & Creative Arts",
      intro:
        "These programs below strive to promote the skills involving the use of media, film, entertainment and Digital or realistic Arts in General.",
      programs: [
        {
          number: 1,
          title: 'The "Passion Play" Cinema Awards',
          aim: "Annual submission of short films/videos depicting the Passion of Christ or other faith related contents. The aim is to Transform the ancient tradition of the Passion Play into a modern cinematic experience, rewarding storytelling that makes the Gospel move on screen.",
        },
        {
          number: 2,
          title: "The Catholic Content Creator Challenge",
          body: "Engage in focused training across digital media where Catholic content creators are encourage to use their skills and platforms to correct the narratives regarding the catholic and to enlighten many who have strayed away or ignorant of the doctrines of the faith .",
        },
        {
          number: 3,
          title: '"Words of Grace" Poetry, Spoken Word and writing programs',
          body: "Benefit from personalized mentorship and participate in poetry community events that nurture growth and development in the use of poetry both spoken and written in the expression of catholic values especially those that touch deep on human life, justice, peace and truth in the society.",
        },
        {
          number: 4,
          title: "Creators' Workshop & Technical Empowerment",
          body: "Free seminars on video editing, storytelling, and digital branding. The aim is bridging the gap between 'having a gift' and 'having the skill,' equipping youths with the professional tools to compete in the global media space.",
        },
      ],
    },
    {
      name: "Pillar 2: Music, Liturgy & Instrumental Excellence",
      intro: "Focusing on musical gifts and the beauty of Catholic worship.",
      programs: [
        {
          number: 5,
          title: 'The "Solomon\'s Porch" Choir & Soloist Competition',
          body: "A search for the best vocalists and choirs within the Catholic Church to recognize, encourage and award them and to equip them further in order to serve the purpose of the liturgy as well as their personal dreams-whether those who want to make a living from this or purely from just passion and service. Aim includes elevating the standard of liturgical music by celebrating the voices that lead our hearts to heaven every Sunday and outside to encourage pious devotions and individual inculturated songs and worship.",
        },
        {
          number: 6,
          title: 'The "David\'s Harp" Instrumentalists Competition',
          body: "Recognizing excellence in organists, guitarists, and orchestral players as well as many instrumentalists. There is a growing concern in the African space where these youths are convinced to join other denominations because they are not being appreciated, paid or even encouraged despite their long years of service to the church. Honoring the skill behind the sound, ensuring the next generation of Catholic instrumentalists plays with both technical mastery and spiritual devotion. It also aims to get them to feel appreciated, recognized and loved.",
        },
        {
          number: 7,
          title: "Catholic Artists or gospel music promotions and programs",
          body: "This is a live, recurring event for Catholic singers to encourage and support them but especially those who have written, sung and produced originals. This program hopes to go physical one day where catholics who are gospel artists are widely recognized and encouraged for their skills and efforts in mission and evangelization. The aim is also to regulate the soundness of the theology behind these songs and to ensure that they are catholic and liturgical.",
          aim: "Breaking geographical borders to create a virtual sanctuary of praise, where the global Catholic youth family meets for a night of song by professional catholic musicians often also referred to as 'gospel artists\".",
        },
      ],
    },
    {
      name: "Pillar 3: Vocational Skills & Economic Empowerment",
      intro:
        "A lot of youths in the Catholic church are in need of empowerment and aid to able to reach their human potentials and dreams.",
      programs: [
        {
          number: 8,
          title: 'The "Talent-to-Trade" Dreams and Business Initiative',
          body: "Grants for small-scale businesses, dreams, passions and school fee assistance for catholic students and youths in tertiary institutions. The aim is to ensure that no dream is buried due to poverty, neglect or lack of opportunity. It involves providing the financial seed for small businesses and the academic support for future leaders.",
        },
        {
          number: 9,
          title: 'The "St. Anne & St. Dominic" Craft Competitions',
          body: 'Competitions in sewing (vestments/altar linens) and the traditional art of Rosary making. here the aim is found in promoting the dignity of manual labor and the preservation of Catholic sacramentals through craftsmanship and design."',
        },
      ],
    },
    {
      name: "Pillar 4: Community, Sports & Faith-Based Entertainment",
      intro:
        'Bringing youths together for "Holy Leisure."and protecting he interest of their catholic faith rather than exposing them to platforms that offer such avenues in exchange for their faith and services.',
      programs: [
        {
          number: 10,
          title: 'The "Catholic Reality" (The Cenacle Project)',
          body: "A faith-based reality experience focused on community living, prayer, and tasks rooted in Catholic social teaching. This is meant to be a catholic reality TV show where catholic morals and societal values are promoted. It aims to teach the youth that they can still be catholics, live the faith and still look 'cool'.",
          aim: '"A revolution in reality entertainment—showing the world that living the faith is a vibrant, challenging, and joyful adventure."',
        },
        {
          number: 11,
          title: 'The "St. Sebastian" Football Cup',
          body: "Inter-parish or regional soccer tournaments to foster unity. Fun and competitions especially soccer moves the youths! This will involve building brotherhood on the pitch, where teamwork, discipline, and sportsmanship become a living witness of the Christian life.",
        },
        {
          number: 12,
          title: 'The "Stars of the Church" Award Night',
          body: "A night of Catholic glamour and grace, honoring the youths who have used their ten talents to light up the world. A grand finale event recognizing the top contributors from all other categories. This does not mean the glory is given to the vessels rather than the maker but to tell the vessels that they can keep doing well to the greater glory of Christ and His body the church.",
        },
        {
          number: 13,
          title: 'The Augustinian "Tolle Lege" Contest',
          body: 'An annual or bi-annual program Themed: "Pick up and Read" – A Journey through Scripture and Tradition. This competition can be individual or parishes. This will involve motivating the youth to go back and begin to study the scriptures, traditional documents of the church etc voraciously and just maybe alot who are lost might find their way back to the church again through these! The aim is Inspired by the pivotal conversion moment of St. Augustine in a Milanese garden, this program seeks to replicate that "divine encounter" for modern youth. By hearing the call to Tolle Lege, participants are challenged to move from passive faith to active, intellectual, and spiritual engagement with the Word of God and the teachings of the Church. Think of this program as a form of spelling Bee Competition but on the faith and catholic doctrine.',
        },
        {
          number: 14,
          title:
            "Catholic Family Life Mentorship and Marriage Preparation (The Ten Talents Initiative Catholic Singles Formation Group).",
          body: "This is a Catholic International platform started by a priest to help single Catholics who are in need of Catholic life partners meet, interact, pray and discern. IT IS BASICALLY ONLINE. It is not just a social match making platform. It is a place of prayer and discernment with God as the lead and the Holy Spirit as the guide.\n\nTHIS IS STRICTLY FOR CATHOLICS IN SEARCH OF THEIRS FELLOW CATHOLIC SPOUSES AND READY TO BE GUIDED IN THE CATHOLIC MARITAL TEACHINGS OF THE CHURCH.\n\nIT IS ALSO FOR CATHOLICS WJO WANT TO BEGIN EARLY ENOUGH TO UNDERSTAND WHAT THE CHURCH IS SAYING ON MARRIAGE AND DONT HAVE TO WAIT TILL THEY HAVE FOUND A LIFE PARTNER.\n\nThe platform also helps in guiding people who have decided to remain single for life by offering the official teachings of the Catholic Church on this and the official way to proceed about it.",
        },
      ],
    },
  ],
  upcomingEventsTitle: "Upcoming events",
  upcomingEventsIntro:
    "Discover upcoming workshops, mentorship sessions, and community gatherings designed to foster growth and meaningful connections.",
  upcomingEvents: [
    {
      title:
        "Catholic Youths Passion Play Video Clip Submission for Awards and Recognition, 2026.",
      details: [
        "(The 2026 version of this program is organized in parnership with the Youth Animation Unit of the Catholic Secretariat of NIgera)",
        "Details: Registration is ended.",
        "Submisions-This will run from the 5th to 11th of April, 2026.",
        "Finals-This will be on the 15th of April,2026.",
      ],
    },
    {
      title: "Easter Tiktok Live Concert for Catholic Artists.",
      details: [
        "Date-7th of April. Handler-Fada Naz",
        "Time-7pm (West African Time) till dawn.",
      ],
    },
    {
      title: "The Tolle Lege Faith Contest",
      details: ["Begins on the 15th of May"],
    },
  ],
};

export const dailyReflectionsPage = {
  title: "Daily reflections",
  intro: "",
};

export const eventsPage = {
  title: "Upcoming Events",
  intro: "Find here all our events",
  emptyMessage: "There are no events scheduled this week.",
  weekLabel: "This Week",
};

export const songsBooksPage = {
  title: "Songs & Books",
  intro:
    "We have books and songs released by some of our catholic youths. You can access them below and make a donation if you wish.",
  releasesTitle: "Old and New Releases",
  releasesIntro:
    "This section highlights the new books and songs from our community.",
  items: [
    {
      title:
        'Poetry Anthology dedicated to the Victims of Persecution in Nigeria and The world by Catholic Poets titled " A Peace Their Fire Cannot Consume."',
      subtitle: "Dialnet-EconomicContributionAndSportSuccessThroughTheSaleO-9046932",
      image: "/images/songs-books/poetry-anthology-cover.jpg",
      downloadUrl: "/files/poetry-anthology.pdf",
      action: "Download",
    },
  ],
};

export const contactPage = {
  title: "Contact Us",
  intro:
    "Check our social media pages, contact us through email or fill out the form below. We will come back to you as soon as possible.",
  social: [
    { label: "TikTok", href: "https://www.tiktok.com/@frnaz5" },
    { label: "WhatsApp", href: "https://wa.me/2347026861002" },
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61585447853379",
    },
    { label: "Mail", href: "mailto:thetentalentsinitiative@gmail.com" },
  ],
};

export const donationsPage = {
  title: "Donations",
  intro:
    "If you would like to make a donation to our initiative and help boost the next generations of Nigerian talent, feel free to use the options below.",
  options: [
    {
      title: "Bank Transfer",
      subtitle: "Bank account details",
      accountName: "The Ten Talents Humanitarian Initiative",
      cta: "Explore More",
    },
    {
      title: "Direct payment",
      cta: "Explore More",
    },
  ],
};

export const donationFailedPage = {
  title: "Donation Failed",
  body: "We're sorry, your donation failed to process. Please try again or contact site support.",
};

export const stats = [
  { value: "2025", label: "Founded in faith" },
  { value: "8", label: "Goals guiding us" },
  { value: "∞", label: "Gifts to nurture" },
];
