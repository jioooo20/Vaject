export const personalData = {
  name: 'Giovano Alkandri',
  role: 'Fullstack Engineer',
  tagline: 'Backend-focused developer with a growing passion for DevOps',
  taglineExtended: 'Building scalable backends, crafting clean APIs, and learning to secure them all.',
  email: 'giovanoalkandri@gmail.com',
  linkedin: 'https://www.linkedin.com/in/giovano-alkandri-a4009b252/',
  github: 'https://github.com/jioooo20',
  resumeUrl: '/cv/cv-giovano-alkandri.pdf',
  bio: [
    'A passionate fullstack engineer with a strong foundation in backend development using Laravel, Express, and NestJS. Experienced in building scalable web applications and RESTful APIs with various database systems.',
    'Currently expanding expertise into DevOps — integrating security practices into the development lifecycle. Proficient in Linux server administration (Debian/Ubuntu), basic networking, and containerization.',
    'Always eager to learn new technologies and solve real-world problems through clean, maintainable code.',
  ],
}

export const skills = [
  {
    category: 'Frontend',
    items: ['React', 'Laravel Blade', 'Tailwind CSS', 'Bootstrap', 'Vue'],
  },
  {
    category: 'Backend',
    items: ['Laravel', 'Express', 'NestJS'],
  },
  {
    category: 'Database',
    items: ['MariaDB', 'MySQL', 'PostgreSQL', 'SQL Server'],
  },
  {
    category: 'DevOps & Tools',
    items: ['Linux (Debian/Ubuntu)', 'Docker', 'Networking (Mikrotik/Cisco)', 'Git'],
  },
]

export const experiences = [
  {
    role: 'Web Developer Intern',
    company: 'PT Multi Spunindo Jaya Tbk',
    location: 'Sidoarjo, Indonesia',
    period: 'Jan 2026 - Present',
    type: 'Internship',
    descriptions: [
      'Developing and maintaining web-based applications for internal business processes',
      'Collaborating with cross-functional teams to deliver software solutions',
      'Implementing RESTful APIs and database integration using modern frameworks',
    ],
  },
  {
    role: 'Teknisi Intern',
    company: 'PT Intidata Telematika',
    location: 'Surabaya, Indonesia',
    period: 'Jun 2022 - Nov 2022',
    type: 'Internship',
    descriptions: [
      'Performed hardware and software maintenance for client systems',
      'Assisted in network troubleshooting and configuration',
      'Provided technical support and documentation for IT infrastructure',
    ],
  },
]

export const projects = [
  {
    title: 'Simpelfas',
    description:
      'Campus facility damage reporting and repair tracking system. Simplifies the process for students, lecturers, and staff to report and monitor facility maintenance.',
    tech: ['Laravel', 'MySQL', 'Blade', 'Bootstrap'],
    github: 'https://github.com/jioooo20/simpelfas',
    image: '/images/projects/simpelfas.svg',
    stars: 3,
  },
  {
    title: 'SIREPANG',
    description:
      'Food recall monitoring system for the Indonesian Food Security Agency. Tracks food safety development and recall events across Malang region.',
    tech: ['Laravel', 'MySQL', 'Tailwind', 'PHP'],
    github: 'https://github.com/a6iyyu/sirepang',
    image: '/images/projects/sirepang.svg',
  },
  {
    title: 'PWL 2025 — Point of Sales',
    description:
      'A Point of Sales web application built with React frontend and Express backend for managing sales transactions.',
    tech: ['React', 'Express', 'MySQL', 'JavaScript'],
    github: 'https://github.com/jioooo20/PWL_2025',
    image: '/images/projects/pwl-pos.svg',
  },
  {
    title: 'Minilog',
    description:
      'Minimal logging system for tracking and monitoring application events and errors across distributed services.',
    tech: ['Vue', 'Node.js', 'JavaScript'],
    github: 'https://github.com/jioooo20/minilog',
    image: '/images/projects/minilog.svg',
  },
  {
    title: 'Fevastify',
    description:
      'A TypeScript-based project showcasing modern development practices, type-safe architecture, and clean code principles.',
    tech: ['TypeScript', 'Node.js'],
    github: 'https://github.com/jioooo20/fevastify',
    image: '/images/projects/fevastify.svg',
  },
  {
    title: 'Belibeli',
    description:
      'A Flutter-based mobile application built with Dart, demonstrating cross-platform development and modern UI patterns.',
    tech: ['Dart', 'Flutter'],
    github: 'https://github.com/jioooo20/belibeli',
    image: '/images/projects/belibeli.svg',
  },
]

export const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]
