
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, Play, Calendar, Clock, Users, User } from 'lucide-react';
import HorizontalSection from '@/components/HorizontalSection';

const Player = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const content = location.state || {};

  // Comprehensive debugging
  console.log('=== PLAYER DEBUG INFO ===');
  console.log('Location state:', location.state);
  console.log('Content object:', content);
  console.log('Content keys:', Object.keys(content));
  console.log('Content.movie:', content.movie);
  console.log('Content.web_series:', content.web_series);
  console.log('Content.show:', content.show);
  console.log('Content.content_type:', content.content_type);
  console.log('========================');

  // Get the actual video URL based on content type
  const getVideoUrl = () => {
    console.log('Getting video URL for content:', content);
    console.log('Content type:', content.content_type);
    
    if (content.content_type === 'Movie' && content.movie?.video_url) {
      console.log('Movie video URL found:', content.movie.video_url);
      return content.movie.video_url;
    } else if (content.content_type === 'Web Series' && content.web_series?.seasons?.[0]?.episodes?.[0]?.video_url) {
      console.log('Web Series video URL found:', content.web_series.seasons[0].episodes[0].video_url);
      return content.web_series.seasons[0].episodes[0].video_url;
    } else if (content.content_type === 'Show' && content.show?.episode_id_list?.length > 0) {
      const showVideoUrl = content.videoUrl || content.video_url;
      console.log('Show video URL found:', showVideoUrl);
      return showVideoUrl;
    }
    
    // Fallback to any video URL in the content object
    const fallbackUrl = content.videoUrl || content.video_url || content.movie?.video_url;
    console.log('Using fallback video URL:', fallbackUrl);
    return fallbackUrl || '';
  };

  // Get trailer URL based on content type
  const getTrailerUrl = () => {
    if (content.content_type === 'Movie' && content.movie?.trailer_url) {
      return content.movie.trailer_url;
    } else if (content.content_type === 'Web Series' && content.web_series?.seasons?.[0]?.trailer_url) {
      return content.web_series.seasons[0].trailer_url;
    } else if (content.content_type === 'Show' && content.show?.trailer_url) {
      return content.show.trailer_url;
    }
    return null;
  };

  const videoUrl = getVideoUrl();
  const trailerUrl = getTrailerUrl();
  
  console.log('Final video URL for player:', videoUrl, 'for content type:', content.content_type);
  console.log('Trailer URL:', trailerUrl);

  // Check if URL is a YouTube URL and convert to embeddable format
  const getEmbeddableUrl = (url: string) => {
    if (!url) return '';
    
    // YouTube URL patterns
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtube.com/embed/')) {
        return url; // Already in embed format
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&modestbranding=1&showinfo=0`;
      }
    }
    
    // Vimeo URL patterns
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()?.split('?')[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}?autoplay=0&title=0&byline=0&portrait=0`;
      }
    }
    
    // Dailymotion URL patterns
    if (url.includes('dailymotion.com')) {
      const videoId = url.split('/video/')[1]?.split('?')[0];
      if (videoId) {
        return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=0&ui-logo=0`;
      }
    }
    
    // For direct video files or other platforms, return as is
    return url;
  };

  const embedUrl = getEmbeddableUrl(videoUrl);
  const trailerEmbedUrl = getEmbeddableUrl(trailerUrl || '');
  const isEmbeddable = videoUrl && (
    videoUrl.includes('youtube.com') || 
    videoUrl.includes('youtu.be') || 
    videoUrl.includes('vimeo.com') || 
    videoUrl.includes('dailymotion.com') ||
    embedUrl !== videoUrl
  );

  const [showTrailer, setShowTrailer] = useState(false);

  const handleTrailerClick = () => {
    if (trailerUrl) {
      setShowTrailer(!showTrailer);
    }
  };

  const mockSeasons = [
    {
      id: 1,
      title: 'Season 1',
      episodes: [
        { id: 1, title: 'Episode 1: The Beginning', duration: '45 min', thumbnail: '/placeholder.svg' },
        { id: 2, title: 'Episode 2: The Journey', duration: '42 min', thumbnail: '/placeholder.svg' },
        { id: 3, title: 'Episode 3: The Discovery', duration: '48 min', thumbnail: '/placeholder.svg' },
      ]
    },
    {
      id: 2,
      title: 'Season 2',
      episodes: [
        { id: 4, title: 'Episode 1: New Beginnings', duration: '46 min', thumbnail: '/placeholder.svg' },
        { id: 5, title: 'Episode 2: The Challenge', duration: '44 min', thumbnail: '/placeholder.svg' },
      ]
    }
  ];

  const mockEpisodes = [
    { id: 1, title: 'Episode 1', rating: 'TV-PG', score: '8.5', image: '/placeholder.svg' },
    { id: 2, title: 'Episode 2', rating: 'TV-PG', score: '8.7', image: '/placeholder.svg' },
    { id: 3, title: 'Episode 3', rating: 'TV-PG', score: '8.3', image: '/placeholder.svg' },
  ];

  const getContentTypeDisplay = () => {
    switch (content.content_type) {
      case 'Movie': return 'Movie';
      case 'Web Series': return 'Web Series';
      case 'Show': return 'TV Show';
      default: return content.content_type || 'Content';
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="bg-primary/5 backdrop-blur-sm border border-primary/30 text-primary hover:bg-gradient-to-br hover:from-black/30 hover:via-[#0A7D4B]/5 hover:to-black/30 hover:border-primary/20 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Video Player */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-black/90 via-[#0A7D4B]/20 to-black/90 backdrop-blur-sm border border-border/50 wave-transition relative overflow-hidden">
                {/* Animated Background Waves */}
                <div className="absolute inset-0">
                  <div className="player-wave-bg-1"></div>
                  <div className="player-wave-bg-2"></div>
                  <div className="player-wave-bg-3"></div>
                </div>

                <CardContent className="p-4 relative z-10">
                  {/* Video Player */}
                  <div className="aspect-video bg-gradient-to-br from-black/95 via-[#0A7D4B]/10 to-black/95 rounded-xl mb-4 relative border border-primary/20 shadow-2xl overflow-hidden custom-video-container">
                    {(showTrailer && trailerUrl) ? (
                      /* Trailer Player */
                      <div className="relative w-full h-full">
                        <iframe
                          className="w-full h-full rounded-xl"
                          src={trailerEmbedUrl}
                          title={`${content.title} - Trailer`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          style={{
                            filter: 'contrast(1.1) brightness(1.05)',
                            border: 'none'
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          <Button
                            onClick={() => setShowTrailer(false)}
                            size="sm"
                            variant="outline"
                            className="bg-black/80 border-white/30 text-white hover:bg-black/60"
                          >
                            Back to Movie
                          </Button>
                        </div>
                      </div>
                    ) : videoUrl ? (
                      isEmbeddable ? (
                        /* Main Content Player */
                        <div className="relative w-full h-full">
                          <iframe
                            className="w-full h-full rounded-xl"
                            src={embedUrl}
                            title={content.title || 'Video Player'}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            style={{
                              filter: 'contrast(1.1) brightness(1.05)',
                              border: 'none'
                            }}
                          />
                          
                          {/* Custom overlay to maintain app theme */}
                          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                        </div>
                      ) : (
                        /* Direct Video File Player */
                        <video
                          className="w-full h-full rounded-xl object-cover custom-video-player"
                          controls
                          poster={content.image || content.thumbnail_url || content.movie?.thumbnail_url}
                          preload="metadata"
                          style={{
                            filter: 'contrast(1.1) brightness(1.05)',
                            outline: 'none'
                          }}
                        >
                          <source src={videoUrl} type="video/mp4" />
                          <source src={videoUrl} type="video/webm" />
                          <source src={videoUrl} type="video/ogg" />
                          Your browser does not support the video tag.
                        </video>
                      )
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-black/95 via-[#0A7D4B]/10 to-black/95 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-red-400 text-lg mb-2">⚠️ Video Not Available</div>
                          <p className="text-muted-foreground text-sm">
                            No video URL found for this content
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-2">
                            Content Type: {content.content_type}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-primary/20 to-[#0A7D4B]/20 backdrop-blur-sm border border-primary/30 rounded-lg px-3 py-1">
                        <span className="text-primary/90 text-sm font-medium">
                          {content.content_type === 'Movie' ? 'Full Movie' : 
                           content.content_type === 'Web Series' ? 'Episode 1' : 
                           'Episode'}
                        </span>
                      </div>
                      {videoUrl && (
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg px-3 py-1">
                          <span className="text-green-400 text-sm font-medium">
                            ✓ Ready
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {trailerUrl && (
                      <Button
                        onClick={handleTrailerClick}
                        size="sm"
                        variant="outline"
                        className="bg-primary/10 backdrop-blur-sm border border-primary/50 text-primary hover:bg-gradient-to-br hover:from-black/60 hover:via-[#0A7D4B]/10 hover:to-black/60 hover:border-primary/30 transition-all duration-300"
                      >
                        <Play className="h-3 w-3 mr-2" />
                        {showTrailer ? 'Back to Content' : 'Watch Trailer'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Episodes/Seasons Section for Web Series and Shows */}
              {(content.content_type === 'Web Series' || content.content_type === 'Show') && (
                <Card className="mt-6 bg-gradient-to-br from-black/90 via-[#0A7D4B]/20 to-black/90 backdrop-blur-sm border border-border/50">
                  <CardContent className="p-6">
                    {content.content_type === 'Show' ? (
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Episodes</h3>
                        <HorizontalSection
                          title=""
                          contents={mockEpisodes}
                          onSeeMore={() => {}}
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Available Seasons</h3>
                        <Tabs defaultValue="season-1" className="w-full">
                          <TabsList className="grid w-full bg-background/50 border border-border/50" style={{
                            gridTemplateColumns: `repeat(${Math.min(mockSeasons.length, 4)}, 1fr)`,
                            gridTemplateRows: mockSeasons.length > 4 ? 'repeat(2, 1fr)' : '1fr'
                          }}>
                            {mockSeasons.map((season) => (
                              <TabsTrigger
                                key={season.id}
                                value={`season-${season.id}`}
                                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs px-2 py-1"
                              >
                                {season.title}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          
                          {mockSeasons.map((season) => (
                            <TabsContent key={season.id} value={`season-${season.id}`} className="mt-4">
                              <div className="space-y-3">
                                {season.episodes.map((episode) => (
                                  <div
                                    key={episode.id}
                                    className="flex items-center space-x-4 p-3 bg-background/30 rounded-lg border border-border/30 hover:bg-background/50 transition-colors cursor-pointer"
                                  >
                                    <img
                                      src={episode.thumbnail}
                                      alt={episode.title}
                                      className="w-20 h-12 object-cover rounded"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (target.src !== '/placeholder.svg') {
                                          target.src = '/placeholder.svg';
                                        }
                                      }}
                                    />
                                    <div className="flex-1">
                                      <h4 className="text-foreground font-medium text-sm">{episode.title}</h4>
                                      <p className="text-muted-foreground text-xs">{episode.duration}</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-gradient-to-br from-black/60 via-[#0A7D4B]/10 to-black/60 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                                    >
                                      <Play className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Side - Content Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Content Information */}
              <Card className="bg-gradient-to-br from-black/90 via-[#0A7D4B]/20 to-black/90 backdrop-blur-sm border border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-xl font-bold text-foreground flex-1">
                      {content.title}
                    </CardTitle>
                    
                    {/* Content Type Badge */}
                    <div className="bg-gradient-to-r from-primary/20 to-[#0A7D4B]/20 backdrop-blur-sm border border-primary/30 rounded-lg px-3 py-1 ml-3">
                      <span className="text-primary/90 text-xs font-medium">
                        {getContentTypeDisplay()}
                      </span>
                    </div>
                  </div>

                  {/* Season Badge for Web Series */}
                  {content.content_type === 'Web Series' && content.seasonNumber && (
                    <div className="mb-3">
                      <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg px-3 py-1 inline-block">
                        <span className="text-blue-300 text-sm font-medium">
                          Season {content.seasonNumber}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Rating and Year */}
                    <div className="flex items-center space-x-3 flex-wrap">
                      {(content.rating || content.rating_type || content.movie?.rating_type || content.show?.rating_type) && (
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30 text-xs font-medium">
                          {content.rating || content.rating_type || content.movie?.rating_type || content.show?.rating_type}
                        </span>
                      )}
                      {(content.year || content.release_year || content.movie?.release_year || content.show?.release_year) && (
                        <span className="text-muted-foreground text-xs">
                          {content.year || content.release_year || content.movie?.release_year || content.show?.release_year}
                        </span>
                      )}
                      {(content.score || content.rating || content.movie?.rating || content.show?.rating) && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-foreground text-xs">
                            {content.score || content.rating || content.movie?.rating || content.show?.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Duration for Movies */}
                    {content.content_type === 'Movie' && content.movie?.duration && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">
                          {content.movie.duration} minutes
                        </span>
                      </div>
                    )}

                    {/* Genres */}
                    {(content.genre || content.genres) && (
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(content.genre || content.genres) 
                          ? (content.genre || content.genres) 
                          : [(content.genre || content.genres)]).map((genre, index) => (
                          <span key={index} className="bg-secondary/20 text-secondary-foreground px-2 py-1 rounded text-xs border border-secondary/30">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    {(content.description || content.movie?.description || content.show?.description) && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Synopsis</h4>
                        <p className="text-foreground/90 text-sm leading-relaxed">
                          {content.description || content.movie?.description || content.show?.description}
                        </p>
                      </div>
                    )}

                    {/* Cast and Crew */}
                    <div className="space-y-3">
                      {/* Directors */}
                      {(content.movie?.director || content.show?.directors) && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            Director{Array.isArray(content.movie?.director || content.show?.directors) && (content.movie?.director || content.show?.directors).length > 1 ? 's' : ''}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {Array.isArray(content.movie?.director || content.show?.directors) 
                              ? (content.movie?.director || content.show?.directors).join(', ')
                              : (content.movie?.director || content.show?.directors)}
                          </p>
                        </div>
                      )}

                      {/* Cast */}
                      {(content.movie?.cast_members || content.show?.cast_members) && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Cast
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {Array.isArray(content.movie?.cast_members || content.show?.cast_members) 
                              ? (content.movie?.cast_members || content.show?.cast_members).slice(0, 5).join(', ')
                              : (content.movie?.cast_members || content.show?.cast_members)}
                            {Array.isArray(content.movie?.cast_members || content.show?.cast_members) && 
                             (content.movie?.cast_members || content.show?.cast_members).length > 5 && '...'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Advertisement Space */}
              <Card className="bg-gradient-to-br from-black/40 via-[#0A7D4B]/10 to-black/40 backdrop-blur-sm border border-border/30 min-h-[200px]">
                <CardContent className="p-6 flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-muted-foreground/50 text-sm mb-2">Advertisement Space</div>
                    <div className="text-muted-foreground/30 text-xs">300x200</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
