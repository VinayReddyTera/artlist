import { Component } from '@angular/core';

@Component({
  selector: 'app-all-artists',
  templateUrl: './all-artists.component.html',
  styleUrls: ['./all-artists.component.css']
})
export class AllArtistsComponent {
  projectData = [
    {
        id: 1,
        image: 'assets/images/users/avatar-1.jpg',
        text: 'New admin Design',
        subtext: 'It will be as simple as Occidental',
        users: ['assets/images/users/avatar-2.jpg', 'assets/images/users/avatar-1.jpg'],
        status: 'Completed',
        date: '15 Oct, 19',
        comment: 214
    },
    {
        id: 2,
        image: 'assets/images/users/avatar-1.jpg',
        text: 'Brand logo design',
        subtext: 'To achieve it would be necessary',
        users: ['assets/images/users/avatar-3.jpg'],
        status: 'Pending',
        date: '22 Oct, 19',
        comment: 183
    },
    {
        id: 3,
        image: 'assets/images/users/avatar-1.jpg',
        text: 'New Landing Design',
        subtext: 'For science, music, sport, etc',
        users: ['assets/images/users/avatar-5.jpg', 'assets/images/users/avatar-4.jpg'],
        status: 'Delay',
        date: '13 Oct, 19',
        comment: 175
    },
    {
        id: 4,
        image: 'assets/images/users/avatar-1.jpg',
        text: 'Redesign - Landing page',
        subtext: 'If several languages coalesce',
        users: ['assets/images/users/avatar-6.jpg','assets/images/users/avatar-4.jpg','assets/images/users/avatar-3.jpg'],
        status: 'Completed',
        date: '14 Oct, 19',
        comment: 202
    },
    {
        id: 5,
        image: 'assets/images/users/avatar-1.jpg',
        text: 'Skote Dashboard UI',
        subtext: 'Separate existence is a myth',
        users: ['assets/images/users/avatar-7.jpg', 'assets/images/users/avatar-8.jpg'],
        status: 'Completed',
        date: '13 Oct, 19',
        comment: 194
    },
    {
        id: 6,
        image: 'assets/images/users/avatar-1.jpg',
        text: 'Blog Template UI',
        subtext: 'For science, music, sport, etc',
        users: ['assets/images/users/avatar-6.jpg'],
        status: 'Pending',
        date: '24 Oct, 19',
        comment: 122
    },
    {
        id: 7,
        image: 'assets/images/users/avatar-1.jpg',
        text: 'Multipurpose Landing',
        subtext: 'It will be as simple as Occidental',
        users: ['assets/images/users/avatar-3.jpg'],
        status: 'Delay',
        date: '15 Oct, 19',
        comment: 214
    },
    {
        id: 8,
        image: 'assets/images/users/avatar-1.jpg',
        text: 'App Landing UI',
        subtext: 'For science, music, sport, etc',
        users: ['assets/images/users/avatar-4.jpg'],
        status: 'Completed',
        date: '11 Oct, 19',
        comment: 185
    },
    {
        id: 9,
        image: 'assets/images/users/avatar-1.jpg',
        text: 'New admin Design',
        subtext: 'Their most common words.',
        users: ['assets/images/users/avatar-5.jpg'],
        status: 'Completed',
        date: '12 Oct, 19',
        comment: 106
    }
];

ngOnInit() {
}

}
