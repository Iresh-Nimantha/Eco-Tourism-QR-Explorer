// data/districtData.ts

// We define a type for our card object for better code quality
export type DistrictCard = {
  title: string;
  image: string;
  href: string;
};

// This is the full list of districts, now in its own dedicated file
export const districtData: DistrictCard[] = [
    { title: 'Colombo', image: '/districts/colombo.jpg', href: '/explore?tag=colombo' },
    { title: 'Gampaha', image: '/districts/gampaha.jpg', href: '/explore?tag=gampaha' },
    { title: 'Kalutara', image: '/districts/kalutara.jpg', href: '/explore?tag=kalutara' },
    { title: 'Kandy', image: '/districts/kandy.jpg', href: '/explore?tag=kandy' },
    { title: 'Matale', image: '/districts/matale.jpg', href: '/explore?tag=matale' },
    { title: 'Nuwara Eliya', image: '/districts/nuwaraeliya.jpg', href: '/explore?tag=nuwara-eliya' },
    { title: 'Galle', image: '/districts/galle.jpg', href: '/explore?tag=galle' },
    { title: 'Matara', image: '/districts/matara.jpg', href: '/explore?tag=matara' },
    { title: 'Hambantota', image: '/districts/hambantota.jpg', href: '/explore?tag=hambantota' },
    { title: 'Jaffna', image: '/districts/jaffna.jpg', href: '/explore?tag=jaffna' },
    { title: 'Kilinochchi', image: '/districts/kilinochchi.jpg', href: '/explore?tag=kilinochchi' },
    { title: 'Mannar', image: '/districts/mannar.jpg', href: '/explore?tag=mannar' },
    { title: 'Vavuniya', image: '/districts/vavuniya.jpg', href: '/explore?tag=vavuniya' },
    { title: 'Mullaitivu', image: '/districts/mullaitivu.jpg', href: '/explore?tag=mullaitivu' },
    { title: 'Batticaloa', image: '/districts/batticaloa.jpg', href: '/explore?tag=batticaloa' },
    { title: 'Ampara', image: '/districts/ampara.jpg', href: '/explore?tag=ampara' },
    { title: 'Trincomalee', image: '/districts/trincomalee.jpg', href: '/explore?tag=trincomalee' },
    { title: 'Kurunegala', image: '/districts/kurunegala.jpg', href: '/explore?tag=kurunegala' },
    { title: 'Puttalam', image: '/districts/puttalam.jpg', href: '/explore?tag=puttalam' },
    { title: 'Anuradhapura', image: '/districts/anuradhapura.jpg', href: '/explore?tag=anuradhapura' },
    { title: 'Polonnaruwa', image: '/districts/polonnaruwa.jpg', href: '/explore?tag=polonnaruwa' },
    { title: 'Badulla', image: '/districts/badulla.jpg', href: '/explore?tag=badulla' },
    { title: 'Monaragala', image: '/districts/monaragala.jpg', href: '/explore?tag=monaragala' },
    { title: 'Ratnapura', image: '/districts/ratnapura.jpg', href: '/explore?tag=ratnapura' },
    { title: 'Kegalle', image: '/districts/kegalle.jpg', href: '/explore?tag=kegalle' },
];