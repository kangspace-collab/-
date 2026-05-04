import { BibleVerse } from './types';

import { BibleVerse, ThemeType } from './types';

export const DEFAULT_VERSES: BibleVerse[] = [
  { "text": "여호와는 나의 목자시니 내게 부족함이 없으리로다", "reference": "시편 23:1" },
  { "text": "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라 참으로 나의 의로운 오른손으로 너를 붙들리라", "reference": "이사야 41:10" },
  { "text": "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", "reference": "빌립보서 4:13" },
  { "text": "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", "reference": "마태복음 11:28" },
  { "text": "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라", "reference": "빌립보서 4:6" }
];

export const BACKGROUND_COLORS = [
  { name: 'Black', value: '#000000', text: '#ffffff' },
  { name: 'Dark Gray', value: '#1a1a1a', text: '#ffffff' },
  { name: 'Navy', value: '#0a192f', text: '#ffffff' },
  { name: 'Deep Green', value: '#064e3b', text: '#ffffff' },
  { name: 'Burgundy', value: '#450a0a', text: '#ffffff' },
  { name: 'White', value: '#ffffff', text: '#000000' },
  { name: 'Cream', value: '#fffbeb', text: '#1a1a1a' },
];

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  image: string;
  textColor: string;
  overlay: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'classic',
    name: '클래식',
    image: '',
    textColor: '#ffffff',
    overlay: 'rgba(0,0,0,0)'
  },
  {
    id: 'spring',
    name: '봄 (벚꽃)',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=1920',
    textColor: '#ffffff',
    overlay: 'rgba(0,0,0,0.3)'
  },
  {
    id: 'summer',
    name: '여름 (바다)',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920',
    textColor: '#ffffff',
    overlay: 'rgba(0,0,0,0.2)'
  },
  {
    id: 'autumn',
    name: '가을 (단풍)',
    image: 'https://images.unsplash.com/photo-1507181179506-39f5d8480403?auto=format&fit=crop&q=80&w=1920',
    textColor: '#ffffff',
    overlay: 'rgba(0,0,0,0.3)'
  },
  {
    id: 'winter',
    name: '겨울 (눈)',
    image: 'https://images.unsplash.com/photo-1418985991508-e47376b99a8a?auto=format&fit=crop&q=80&w=1920',
    textColor: '#ffffff',
    overlay: 'rgba(0,0,0,0.3)'
  },
  {
    id: 'rain',
    name: '비 오는 날',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=1920',
    textColor: '#ffffff',
    overlay: 'rgba(0,0,0,0.4)'
  },
  {
    id: 'forest',
    name: '숲속의 햇살',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1920',
    textColor: '#ffffff',
    overlay: 'rgba(0,0,0,0.2)'
  }
];
