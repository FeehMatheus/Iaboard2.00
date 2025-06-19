import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Juliane Borges',
    achievement: 'Renda recorrente mensal de mais de R$10.000,00',
    videoId: 'PJqLUrWbO4k',
    thumbnail: 'https://img.youtube.com/vi/PJqLUrWbO4k/maxresdefault.jpg'
  },
  {
    id: 2,
    name: 'Rafael dos Santos',
    achievement: 'Mais de 1 milhão e meio de reais faturados',
    videoId: 'S1TJdfGcixA',
    thumbnail: 'https://img.youtube.com/vi/S1TJdfGcixA/maxresdefault.jpg'
  },
  {
    id: 3,
    name: 'Guilherme de Jesus',
    achievement: 'Mais de 1 milhão de reais faturados',
    videoId: 'DTbZsOHo05g',
    thumbnail: 'https://img.youtube.com/vi/DTbZsOHo05g/maxresdefault.jpg'
  },
  {
    id: 4,
    name: 'Raphael Romie',
    achievement: 'Mais de 8 dígitos anuais',
    videoId: 'eUpTfcd_OAU',
    thumbnail: 'https://img.youtube.com/vi/eUpTfcd_OAU/maxresdefault.jpg'
  }
];

export function VideoTestimonials() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="bg-gray-800 border-gray-700 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              {playingVideo === testimonial.videoId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <div 
                  className="relative w-full h-full bg-cover bg-center cursor-pointer group"
                  style={{ backgroundImage: `url(${testimonial.thumbnail})` }}
                  onClick={() => setPlayingVideo(testimonial.videoId)}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black p-0"
                    >
                      <Play className="w-6 h-6 ml-1" fill="currentColor" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{testimonial.name}</h3>
              <p className="text-gray-300">{testimonial.achievement}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}