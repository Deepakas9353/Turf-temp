const turfData = [
    {
        id: 'cricket',
        name: 'Cricket Arena',
        sportType: 'Cricket',
        tagline: 'Standard professional pitch for night matches',
        shortDesc: 'Professional high-quality cricket pitch with stadium-grade floodlights.',
        description: 'Our cricket turf is designed for both professional practice and local matches. Featuring high-density synthetic grass and a perfectly leveled pitch, it offers a real-ground experience. The facility is equipped with high-intensity LED floodlights for night matches.',
        price: 1500,
        rating: 4.8,
        maxPlayers: 22,
        images: ['cricket.jpg', 'gallery_1.jpg', 'hero.jpg'],
        amenities: ['Parking', 'Flood Lights', 'Changing Room', 'Washroom', 'Equipment Rental', 'Drinking Water'],
        rules: ['Sports shoes required', 'No smoking/alcohol', 'Booking ends on time', 'Maintain discipline']
    },
    {
        id: 'football',
        name: 'Football Pro Field',
        sportType: 'Football',
        tagline: 'Best-in-class grass for high energy games',
        shortDesc: 'FIFA quality synthetic grass perfect for 5-a-side and 7-a-side matches.',
        description: 'Turf Arena provides an exceptional football experience with soft synthetic grass that reduces injury risk. The markings are clear for 5v5 and 7v7 games. It is the perfect place for football enthusiasts to showcase their skills.',
        price: 1200,
        rating: 4.7,
        maxPlayers: 14,
        images: ['football.jpg', 'gallery_2.jpg', 'hero.jpg'],
        amenities: ['Parking', 'Flood Lights', 'Changing Room', 'Washroom', 'First Aid'],
        rules: ['Studded shoes allowed (plastic)', 'No rough play', 'Stay within boundaries']
    },
    {
        id: 'badminton',
        name: 'Elite Badminton Court',
        sportType: 'Badminton',
        tagline: 'Pro performance mats with non-glare lights',
        shortDesc: 'Elite indoor court with professional blue mat flooring.',
        description: 'Our indoor badminton courts feature professional-grade shock-absorbing mats to protect your joints. The bright, non-glare lighting ensures perfect visibility for fast-paced games.',
        price: 400,
        rating: 4.9,
        maxPlayers: 4,
        images: ['badminton.jpg', 'gallery_1.jpg'],
        amenities: ['Professional Mat', 'Equipment Rental', 'Washroom', 'Changing Room', 'Drinking Water'],
        rules: ['Non-marking shoes only', 'Bring your own shuttle or buy here', '1 hour minimum booking']
    },
    {
        id: 'swimming',
        name: 'Turf Arena Pool',
        sportType: 'Swimming',
        tagline: 'Cool down in our luxury temperature pool',
        shortDesc: 'Temperature controlled luxury pool for relaxation and training.',
        description: 'Enjoy a refreshing swim in our state-of-the-art temperature-controlled pool. Whether you are training for a competition or just want to relax, our clean and well-maintained facility is the best in the city.',
        price: 300,
        rating: 4.6,
        maxPlayers: 20,
        images: ['swimming.jpg', 'gallery_2.jpg'],
        amenities: ['Locker Room', 'Shower Facility', 'Coach Available', 'Towel Service', 'Changing Room'],
        rules: ['Proper swimwear required', 'Shower before entry', 'No running on deck']
    }
];

const nearbyPlaces = [
    { id: 'cafe', name: 'Cafe Delight', distance: '50 meters', icon: 'fas fa-coffee', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800' },
    { id: 'shop', name: 'Elite Sports Shop', distance: '120 meters', icon: 'fas fa-shopping-bag', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
    { id: 'parking', name: 'Safe Parking Area', distance: '10 meters', icon: 'fas fa-parking', img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800' },
    { id: 'juice', name: 'Fresh Juice Center', distance: '80 meters', icon: 'fas fa-wine-glass-alt', img: 'https://images.unsplash.com/photo-1622597467836-f3385e44aa19?auto=format&fit=crop&q=80&w=800' },
    { id: 'metro', name: 'Metro Station', distance: '250 meters', icon: 'fas fa-subway', img: 'https://images.unsplash.com/photo-1512351234903-887413444498?auto=format&fit=crop&q=80&w=800' },
    { id: 'bus', name: 'Bus Stop', distance: '100 meters', icon: 'fas fa-bus', img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800' }
];

const specialOffers = [
    {
        title: 'Weekend Cricket Offer',
        desc: '20% Discount for Morning Slots (6 AM - 10 AM)',
        color: '#ff4b2b'
    },
    {
        title: 'Football Turf Offer',
        desc: 'Book 2 Hours Get 30 Minutes Free on Weekdays',
        color: '#2b5876'
    },
    {
        title: 'Student Offer',
        desc: 'Flat 15% OFF for College Teams with ID Cards',
        color: '#fbc02d'
    }
];

const userReviews = [
    { name: 'Rahul Sharma', rating: 5, comment: 'Great turf and lighting! Best in the area.' },
    { name: 'Ankit Verma', rating: 4, comment: 'Nice place to play football. The staff is polite.' },
    { name: 'Sneha Gupta', rating: 5, comment: 'Very clean swimming pool and good changing rooms.' },
    { name: 'Vikram Singh', rating: 4, comment: 'Badminton court mats are professional. Highly recommend.' }
];

const dummyBookings = [
    { id: 'BK123', facility: 'Cricket Arena', date: '2026-03-15', time: '07:00 PM - 08:00 PM', status: 'Confirmed', price: 1500, duration: '1 hr' }
];

const amenityData = [
    {
        id: 'parking',
        name: 'Parking Area',
        icon: 'fas fa-parking',
        img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800',
        description: 'Spacious and secure parking area available for all visitors.',
        benefits: ['CCTV surveillance', 'Designated zones for 2 and 4 wheelers', 'Safe and well-lit at night']
    },
    {
        id: 'lights',
        name: 'Flood Lights',
        icon: 'fas fa-lightbulb',
        img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=800',
        description: 'High quality flood lights allow players to enjoy night matches.',
        benefits: ['Stadium-grade LED lighting', 'No dark corners', 'Perfect for evening tournament matches']
    },
    {
        id: 'rooms',
        name: 'Changing Rooms',
        icon: 'fas fa-door-open',
        img: 'https://images.unsplash.com/photo-1520263115673-610416f52ab6?auto=format&fit=crop&q=80&w=800',
        description: 'Clean and hygienic changing rooms for players.',
        benefits: ['Individual lockers', 'Private stalls', 'Regularly sanitized throughout the day']
    },
    {
        id: 'washrooms',
        name: 'Washrooms',
        icon: 'fas fa-restroom',
        img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        description: 'Well maintained washrooms available for players and visitors.',
        benefits: ['Sanitized facilities', 'Constant water supply', 'Soap and sanitizer available']
    },
    {
        id: 'water',
        name: 'Drinking Water',
        icon: 'fas fa-tint',
        img: 'https://images.unsplash.com/photo-1523362622744-8393ddfac16d?auto=format&fit=crop&q=80&w=800',
        description: 'Safe and purified drinking water available for all players.',
        benefits: ['RO purified water', 'Aquaguard filtration', 'Hygienic dispensers at multiple locations']
    },
    {
        id: 'rental',
        name: 'Equipment Rental',
        icon: 'fas fa-table-tennis',
        img: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800',
        description: 'Sports equipment available for rent if players forget their gear.',
        benefits: ['Latest sports gear', 'Affordable rates', 'Bats, balls, rackets, and studs available']
    },
    {
        id: 'aid',
        name: 'First Aid Support',
        icon: 'fas fa-medkit',
        img: 'https://images.unsplash.com/photo-1603398938378-e54eab446f91?auto=format&fit=crop&q=80&w=800',
        description: 'Basic first aid support available for minor injuries.',
        benefits: ['Trained staff', 'Fully stocked medical kit', 'Emergency protocol in place']
    }
];

window.arenaData = {
    facilities: turfData,
    turfs: turfData,
    amenities: amenityData,
    nearby: nearbyPlaces,
    reviews: userReviews,
    bookings: dummyBookings,
    offers: specialOffers,
    challenges: [
        {
            id: 'CH001',
            teamName: 'Thunder Strikers',
            sport: 'Cricket',
            players: 8,
            date: '2026-03-10',
            time: '05:00 PM - 06:00 PM',
            location: 'Turf Arena',
            status: 'Looking for opponent',
            teamIcon: 'fas fa-bolt',
            sportIcon: 'fas fa-cricket-bat-ball'
        },
        {
            id: 'CH002',
            teamName: 'Goal Getters',
            sport: 'Football',
            players: 5,
            date: '2026-03-12',
            time: '07:00 PM - 08:30 PM',
            location: 'Turf Arena',
            status: 'Looking for opponent',
            teamIcon: 'fas fa-futbol',
            sportIcon: 'fas fa-futbol'
        },
        {
            id: 'CH003',
            teamName: 'Smash Kings',
            sport: 'Badminton',
            players: 2,
            date: '2026-03-11',
            time: '06:00 PM - 07:00 PM',
            location: 'Turf Arena',
            status: 'Looking for opponent',
            teamIcon: 'fas fa-crown',
            sportIcon: 'fas fa-shuttlecock'
        }
    ],
    recruitment: [
        {
            id: 'REC_DEF_01',
            teamName: 'Morning Warriors',
            sport: 'Cricket',
            currentPlayers: 5,
            neededPlayers: 2,
            date: '2026-03-15',
            time: '06:00 AM - 09:00 AM',
            location: 'Turf Arena',
            teamIcon: 'fas fa-sun',
            status: 'Waiting for Joiners',
            allowJoin: true
        }
    ],
    leaderboard: [
        // CRICKET
        { rank: 1, teamName: 'Fire Dragons', sport: 'Cricket', points: 1500, stars: 4.9, matchZone: 'North Zone', played: 45, won: 35, against: 'Thunder Strikers', score: 'Won by 4 wickets', photos: ['cricket.jpg'] },
        { rank: 2, teamName: 'Thunder Strikers', sport: 'Cricket', points: 1420, stars: 4.7, matchZone: 'South Zone', played: 40, won: 30, against: 'Mighty Bats', score: 'Lost by 15 runs', photos: ['hero.jpg'] },
        { rank: 3, teamName: 'Mighty Bats', sport: 'Cricket', points: 1350, stars: 4.5, matchZone: 'East Zone', played: 38, won: 25, against: 'Fire Dragons', score: 'Won by 10 runs', photos: [] },
        { rank: 4, teamName: 'Spin Kings', sport: 'Cricket', points: 1200, stars: 4.2, matchZone: 'West Zone', played: 35, won: 20, against: 'Pace Masters', score: 'Won by 5 wickets', photos: [] },
        { rank: 5, teamName: 'Pace Masters', sport: 'Cricket', points: 1150, stars: 4.0, matchZone: 'North Zone', played: 30, won: 18, against: 'Spin Kings', score: 'Lost by 5 wickets', photos: [] },

        // FOOTBALL
        { rank: 1, teamName: 'Night Warriors', sport: 'Football', points: 1800, stars: 5.0, matchZone: 'South Zone', played: 50, won: 45, against: 'Goal Getters', score: 'Won 3-1', photos: ['football.jpg'] },
        { rank: 2, teamName: 'Goal Getters', sport: 'Football', points: 1650, stars: 4.8, matchZone: 'East Zone', played: 48, won: 38, against: 'Night Warriors', score: 'Lost 1-3', photos: ['gallery_2.jpg'] },
        { rank: 3, teamName: 'Red Devils', sport: 'Football', points: 1500, stars: 4.6, matchZone: 'West Zone', played: 45, won: 32, against: 'Blue Eagles', score: 'Won 2-0', photos: [] },
        { rank: 4, teamName: 'Blue Eagles', sport: 'Football', points: 1400, stars: 4.4, matchZone: 'North Zone', played: 42, won: 28, against: 'Red Devils', score: 'Lost 0-2', photos: [] },
        { rank: 5, teamName: 'Golden Strikers', sport: 'Football', points: 1300, stars: 4.1, matchZone: 'South Zone', played: 40, won: 25, against: 'Iron Defends', score: 'Won 1-0', photos: [] },

        // BADMINTON
        { rank: 1, teamName: 'Smash Kings', sport: 'Badminton', points: 1200, stars: 4.9, matchZone: 'East Zone', played: 42, won: 38, against: 'Shuttle Masters', score: 'Won 2-0 sets', photos: ['badminton.jpg'] },
        { rank: 2, teamName: 'Shuttle Masters', sport: 'Badminton', points: 1100, stars: 4.7, matchZone: 'West Zone', played: 40, won: 32, against: 'Smash Kings', score: 'Lost 0-2 sets', photos: ['gallery_1.jpg'] },
        { rank: 3, teamName: 'Court Rulers', sport: 'Badminton', points: 1000, stars: 4.5, matchZone: 'North Zone', played: 38, won: 28, against: 'Net Ninjas', score: 'Won 2-1 sets', photos: [] },

        // SWIMMING
        { rank: 1, teamName: 'Aqua Speed', sport: 'Swimming', points: 950, stars: 4.8, matchZone: 'South Zone', played: 20, won: 18, against: 'Water Gliders', score: '1st in 100m Free', photos: ['swimming.jpg'] },
        { rank: 2, teamName: 'Water Gliders', sport: 'Swimming', points: 880, stars: 4.6, matchZone: 'East Zone', played: 22, won: 15, against: 'Aqua Speed', score: '2nd in 100m Free', photos: [] },

        // BASKETBALL
        { rank: 1, teamName: 'Hoop Legends', sport: 'Basketball', points: 1400, stars: 4.9, matchZone: 'North Zone', played: 35, won: 30, against: 'Dunk Masters', score: 'Won 78-72', photos: [] },
        { rank: 2, teamName: 'Dunk Masters', sport: 'Basketball', points: 1320, stars: 4.7, matchZone: 'West Zone', played: 36, won: 25, against: 'Hoop Legends', score: 'Lost 72-78', photos: [] }
    ]
};
