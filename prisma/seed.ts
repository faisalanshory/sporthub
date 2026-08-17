import { PrismaClient, UserRole, BookingStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Generate random JWT secret for demonstration
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  console.log('====================================================');
  console.log('JWT_SECRET (add this to your .env):');
  console.log(jwtSecret);
  console.log('====================================================');

  // 2. Create Users (Admin & Customer demo accounts)
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const customerPassword = await bcrypt.hash('Customer123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sporthub.demo' },
    update: {},
    create: {
      email: 'admin@sporthub.demo',
      name: 'Admin SportHub',
      password: adminPassword,
      role: UserRole.ADMIN,
      phone: '081234567890',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@sporthub.demo' },
    update: {},
    create: {
      email: 'customer@sporthub.demo',
      name: 'Customer Demo',
      password: customerPassword,
      role: UserRole.CUSTOMER,
      phone: '089876543210',
    },
  });

  // 3. Create Venue
  const venue = await prisma.venue.upsert({
    where: { slug: 'sporthub-arena-jakarta' },
    update: {},
    create: {
      name: 'SportHub Arena Jakarta',
      slug: 'sporthub-arena-jakarta',
      description: 'The premium sports destination in Jakarta. Featuring top-notch courts exclusively for Padel lovers.',
      address: 'Jl. Sudirman No. 123, Central Jakarta',
      phone: '+62 811 2233 4455',
      email: 'hello@sporthub.demo',
      openTime: '07:00',
      closeTime: '23:00',
      facilities: JSON.stringify(['Parking', 'Locker Room', 'Shower', 'Cafe', 'Pro Shop', 'Wi-Fi']),
    },
  });

  // 4. Create Sports (Only Padel)
  const padelSport = await prisma.sport.upsert({
    where: { venueId_slug: { venueId: venue.id, slug: 'padel' } },
    update: {},
    create: {
      venueId: venue.id,
      name: 'Padel',
      slug: 'padel',
      icon: '🎾',
      sortOrder: 0,
    },
  });

  // 5. Create Courts (2 Padel Courts)
  for (let i = 1; i <= 2; i++) {
    await prisma.court.upsert({
      where: { sportId_slug: { sportId: padelSport.id, slug: `padel-court-0${i}` } },
      update: {},
      create: {
        sportId: padelSport.id,
        name: `Padel Court 0${i}`,
        slug: `padel-court-0${i}`,
        capacity: 4,
        pricePerHour: 250000,
        isIndoor: true,
        facilities: JSON.stringify(['Premium Glass Walls', 'Artificial Turf', 'LED Lighting']),
      },
    });
  }

  // 6. Court Layouts (dummy coordinates for the visual builder)
  const allCourts = await prisma.court.findMany();
  let currentY = 50;
  for (const court of allCourts) {
    await prisma.courtLayout.upsert({
      where: { courtId: court.id },
      update: {},
      create: {
        courtId: court.id,
        x: 50,
        y: currentY,
        width: 150,
        height: 100,
        rotation: 0,
      },
    });
    currentY += 120;
  }

  // 7. Create Events (Only Padel Events)
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 7);

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 7);

  await prisma.event.createMany({
    data: [
      {
        venueId: venue.id,
        sportId: padelSport.id,
        title: 'Open Tournament Padel Jakarta',
        slug: 'open-tournament-padel-jakarta',
        description: 'Turnamen Padel terbuka untuk semua kalangan. Hadiah jutaan rupiah dan merchandise eksklusif!',
        coverImage: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800',
        date: eventDate,
        startTime: '08:00',
        endTime: '17:00',
        location: venue.name,
        maxParticipants: 32,
        fee: 250000,
        status: 'UPCOMING',
        isPrivate: false,
        creatorId: admin.id,
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800"
        ])
      },
      {
        venueId: venue.id,
        sportId: padelSport.id,
        title: 'Latihan Rutin Padel (Private)',
        slug: 'latihan-rutin-padel',
        description: 'Latihan khusus untuk member VIP SportHub. Masukkan kode undangan untuk bergabung.',
        coverImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34f8?auto=format&fit=crop&w=800',
        date: eventDate,
        startTime: '19:00',
        endTime: '21:00',
        location: venue.name,
        maxParticipants: 8,
        fee: 0,
        status: 'UPCOMING',
        isPrivate: true,
        privateCode: 'PADELVIP',
        creatorId: admin.id
      },
      {
        venueId: venue.id,
        sportId: padelSport.id,
        title: 'Padel Coaching Clinic (Selesai)',
        slug: 'padel-coaching-clinic-past',
        description: 'Belajar teknik dasar Padel langsung dari pelatih profesional. Acara sudah selesai minggu lalu.',
        coverImage: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800',
        date: pastDate,
        startTime: '10:00',
        endTime: '12:00',
        location: venue.name,
        maxParticipants: 16,
        fee: 100000,
        status: 'COMPLETED',
        isPrivate: false,
        creatorId: admin.id
      },
      {
        venueId: venue.id,
        sportId: padelSport.id,
        title: 'Sparring Padel Santai (Selesai)',
        slug: 'sparring-padel-santai-past',
        description: 'Main santai dan cari keringat bareng komunitas Padel Jakarta. Acara sudah selesai minggu lalu.',
        coverImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34f8?auto=format&fit=crop&w=800',
        date: pastDate,
        startTime: '16:00',
        endTime: '18:00',
        location: venue.name,
        maxParticipants: 12,
        fee: 50000,
        status: 'COMPLETED',
        isPrivate: false,
        creatorId: customer.id
      }
    ],
    skipDuplicates: true,
  });

  // 8. Create Articles
  await prisma.article.createMany({
    data: [
      {
        title: 'Mengenal Padel: Olahraga Raket yang Sedang Tren',
        slug: 'mengenal-padel-olahraga-tren',
        content: 'Padel adalah olahraga yang menggabungkan elemen tenis dan squash. Dimainkan di lapangan tertutup dengan dinding kaca, olahraga ini sangat menyenangkan dan mudah dipelajari oleh pemula sekalipun...',
        coverImage: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800',
        authorId: admin.id,
      },
      {
        title: 'Tips Memilih Raket Padel untuk Pemula',
        slug: 'tips-memilih-raket-padel-pemula',
        content: 'Bagi pemula, memilih raket padel yang tepat sangat penting. Raket berbentuk bulat (round) sangat direkomendasikan karena memiliki sweet spot yang luas, sehingga lebih mudah dikontrol...',
        coverImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34f8?auto=format&fit=crop&w=800',
        authorId: admin.id,
      }
    ],
    skipDuplicates: true,
  });

  // 9. Dummy past bookings
  const pastBookingsData = [
    {
      userId: customer.id,
      reference: 'BOOK-445566',
      status: BookingStatus.COMPLETED,
      totalAmount: 500000, // 2 hours
      guestName: 'Customer Demo (Past)',
      guestEmail: 'customer@sporthub.demo',
      guestPhone: '089876543210',
      createdAt: pastDate,
      payment: {
        create: {
          amount: 500000,
          method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.PAID,
          paidAt: pastDate
        }
      },
      items: {
        create: [
          { courtId: allCourts[1].id, date: pastDate, startTime: '16:00', endTime: '17:00', price: 250000 },
          { courtId: allCourts[1].id, date: pastDate, startTime: '17:00', endTime: '18:00', price: 250000 }
        ]
      }
    },
    {
      userId: customer.id,
      reference: 'BOOK-778899',
      status: BookingStatus.COMPLETED,
      totalAmount: 250000,
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      guestPhone: '081122334455',
      createdAt: pastDate,
      payment: {
        create: {
          amount: 250000,
          method: PaymentMethod.BANK_TRANSFER,
          status: PaymentStatus.PAID,
          paidAt: pastDate
        }
      },
      items: {
        create: [
          { courtId: allCourts[0].id, date: pastDate, startTime: '10:00', endTime: '11:00', price: 250000 }
        ]
      }
    }
  ];

  for (const data of pastBookingsData) {
    await prisma.booking.create({ data });
  }

  // 11. Create Activity Logs (Highlights)
  console.log('Seeding activity logs...');
  await prisma.highlight.createMany({
    data: [
      {
        title: 'New Booking Created',
        description: 'Customer Demo just booked Padel Court 01 for 2 hours.',
        mediaUrl: '',
        type: 'IMAGE',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      },
      {
        title: 'Event Registration',
        description: 'John Doe registered for Open Tournament Padel Jakarta.',
        mediaUrl: '',
        type: 'IMAGE',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        title: 'System Update',
        description: 'Admin updated the operating hours for SportHub Arena Jakarta.',
        mediaUrl: '',
        type: 'IMAGE',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
