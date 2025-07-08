"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  CheckCircle,
  Circle,
  Star,
  Users,
  Menu,
  Download,
  BookOpen,
  Move,
  Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

function ModernVideoPlayer({ currentLesson }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const videoRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [videoQuality, setVideoQuality] = useState("1080p")

  // Reset video state when lesson changes
  useEffect(() => {
    if (currentLesson) {
      // Convert duration string (e.g. "15:45") to seconds
      const durationParts = currentLesson.duration?.split(":") || ["0", "0"]
      const durationInSeconds = Number.parseInt(durationParts[0]) * 60 + Number.parseInt(durationParts[1])
      setDuration(durationInSeconds || 945) // Default to 15:45 if parsing fails

      // Reset playback state
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [currentLesson])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlay = () => setIsPlaying(!isPlaying)
  const handleProgressChange = (value) => setCurrentTime(value[0])
  const handleVolumeChange = (value) => {
    setVolume(value[0])
    setIsMuted(value[0] === 0)
  }
  const toggleMute = () => setIsMuted(!isMuted)
  const skipBackward = () => setCurrentTime(Math.max(0, currentTime - 10))
  const skipForward = () => setCurrentTime(Math.min(duration, currentTime + 10))

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error("Fullscreen error:", error)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Drag functionality
  const handleMouseDown = (e) => {
    if (e.target.closest(".video-controls") || e.target.closest(".video-content")) return

    setIsDragging(true)
    const rect = videoRef.current.getBoundingClientRect()
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    e.preventDefault()
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    // Constrain to viewport
    const maxX = window.innerWidth - (isFloating ? 400 : videoRef.current.offsetWidth)
    const maxY = window.innerHeight - (isFloating ? 400 : videoRef.current.offsetHeight)

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const toggleFloating = () => {
    setIsFloating(!isFloating)
    if (!isFloating) {
      // Set initial floating position
      setPosition({ x: window.innerWidth - 420, y: 20 })
    } else {
      // Reset position when returning to normal
      setPosition({ x: 0, y: 0 })
    }
  }

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  // Simulate video progress
  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  const videoPlayerStyle = isFloating
    ? {
        position: "fixed",
        top: position.y,
        left: position.x,
        width: "400px",
        height: "225px",
        zIndex: 1000,
        transform: "none",
        cursor: isDragging ? "grabbing" : "grab",
      }
    : {
        position: "relative",
        width: "100%",
        cursor: isDragging ? "grabbing" : "grab",
        ...(isFullscreen && {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          backgroundColor: "black",
        }),
      }

  const playbackSpeeds = [
    { label: "0.25x", value: 0.25 },
    { label: "0.5x", value: 0.5 },
    { label: "0.75x", value: 0.75 },
    { label: "Normal", value: 1 },
    { label: "1.25x", value: 1.25 },
    { label: "1.5x", value: 1.5 },
    { label: "1.75x", value: 1.75 },
    { label: "2x", value: 2 },
  ]

  const videoQualities = [
    { label: "Auto", value: "auto", description: "Adjust automatically" },
    { label: "1080p HD", value: "1080p", description: "High quality" },
    { label: "720p HD", value: "720p", description: "Good quality" },
    { label: "480p", value: "480p", description: "Standard quality" },
    { label: "360p", value: "360p", description: "Lower quality" },
  ]

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed)
  }

  const handleQualityChange = (quality) => {
    setVideoQuality(quality)
  }

  // Generate a gradient based on the lesson title for visual variety
  const getGradient = () => {
    if (!currentLesson) return "from-purple-900 via-blue-900 to-indigo-900"

    const lessonId = currentLesson.id || 1
    const gradients = [
      "from-purple-900 via-blue-900 to-indigo-900",
      "from-blue-900 via-indigo-900 to-purple-900",
      "from-indigo-900 via-purple-900 to-blue-900",
      "from-pink-900 via-purple-900 to-indigo-900",
      "from-rose-900 via-pink-900 to-purple-900",
      "from-orange-900 via-rose-900 to-pink-900",
    ]

    return gradients[(lessonId - 1) % gradients.length]
  }

  return (
    <div className="relative w-full">
      {/* Responsive Video Container */}
      <div
        ref={videoRef}
        style={videoPlayerStyle}
        onMouseDown={handleMouseDown}
        className={`relative bg-gradient-to-br ${getGradient()} overflow-hidden rounded-lg shadow-2xl ${
          isFloating ? "border-2 border-white/20" : isFullscreen ? "rounded-none" : "aspect-video"
        }`}
      >
        {/* Drag Handle */}
        {isFloating && (
          <div className="absolute top-2 left-2 z-20">
            <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
              <Move className="h-3 w-3 text-white" />
              <span className="text-xs text-white">Drag to move</span>
            </div>
          </div>
        )}

        {/* Floating Controls */}
        {isFloating && (
          <div className="absolute top-2 right-2 z-20">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
              onClick={toggleFloating}
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-500" />
        </div>

        {/* Video Content */}
        <div className="video-content absolute inset-0 flex items-center justify-center z-10 p-4 pointer-events-none">
          <div className="text-center text-white max-w-full">
            <div className="mb-4 sm:mb-6">
              {/* Main Play Button */}
              <div
                className={`bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30 shadow-2xl pointer-events-auto ${
                  isFloating ? "w-12 h-12" : "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
                }`}
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className={`text-white ${isFloating ? "h-4 w-4" : "h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10"}`} />
                ) : (
                  <Play
                    className={`text-white ml-1 ${isFloating ? "h-4 w-4" : "h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10"}`}
                  />
                )}
              </div>

              {/* Control Buttons */}
              {!isFloating && (
                <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-6">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/30 h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 p-0 flex flex-col items-center justify-center pointer-events-auto"
                    onClick={skipBackward}
                  >
                    <SkipBack className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    <span className="text-xs mt-1">10s</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/30 h-16 w-16 sm:h-18 sm:w-18 lg:h-20 lg:w-20 p-0 pointer-events-auto"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                    ) : (
                      <Play className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ml-1" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/30 h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 p-0 flex flex-col items-center justify-center pointer-events-auto"
                    onClick={skipForward}
                  >
                    <SkipForward className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    <span className="text-xs mt-1">10s</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Video Info */}
            {!isFloating && (
              <div className="backdrop-blur-sm bg-black/20 rounded-lg p-4 sm:p-6 border border-white/20 max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 line-clamp-2">
                  {currentLesson?.title || "Select a lesson"}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-1 truncate">{currentLesson?.courseName}</p>
                <p className="text-xs sm:text-sm opacity-75">with {currentLesson?.instructor}</p>
                {(playbackSpeed !== 1 || videoQuality !== "1080p") && (
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-75">
                    {playbackSpeed !== 1 && (
                      <span className="bg-white/20 px-2 py-1 rounded">Speed: {playbackSpeed}x</span>
                    )}
                    {videoQuality !== "1080p" && (
                      <span className="bg-white/20 px-2 py-1 rounded">Quality: {videoQuality}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Video Controls */}
        <div className="video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          {/* Progress Bar */}
          <div className={`pt-4 pb-2 ${isFloating ? "px-2" : "px-4 sm:px-6 lg:px-8"}`}>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
              className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&>span:first-child]:h-2"
            />
          </div>

          {/* Controls Row */}
          <div className={`pb-4 ${isFloating ? "px-2" : "px-4 sm:px-6 lg:px-8"}`}>
            {/* Mobile/Floating Layout */}
            <div className={`flex items-center justify-between ${isFloating ? "" : "sm:hidden"}`}>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  onClick={skipBackward}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  onClick={skipForward}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-xs text-white font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <div className="flex items-center gap-1">
                {!isFloating && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={toggleFloating}
                    title="Picture in Picture"
                  >
                    <Move className="h-4 w-4" />
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white" align="end">
                    <DropdownMenuLabel className="text-gray-300">Video Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-white hover:bg-gray-800">
                        <div className="flex items-center justify-between w-full">
                          <span>Speed</span>
                          <span className="text-sm text-gray-400">{playbackSpeed}x</span>
                        </div>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="bg-gray-900 border-gray-700">
                        {playbackSpeeds.map((speed) => (
                          <DropdownMenuItem
                            key={speed.value}
                            onClick={() => handleSpeedChange(speed.value)}
                            className={`text-white hover:bg-gray-800 cursor-pointer ${
                              playbackSpeed === speed.value ? "bg-purple-600" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{speed.label}</span>
                              {playbackSpeed === speed.value && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-white hover:bg-gray-800">
                        <div className="flex items-center justify-between w-full">
                          <span>Quality</span>
                          <span className="text-sm text-gray-400">{videoQuality}</span>
                        </div>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="bg-gray-900 border-gray-700">
                        {videoQualities.map((quality) => (
                          <DropdownMenuItem
                            key={quality.value}
                            onClick={() => handleQualityChange(quality.value)}
                            className={`text-white hover:bg-gray-800 cursor-pointer ${
                              videoQuality === quality.value ? "bg-purple-600" : ""
                            }`}
                          >
                            <div className="flex flex-col items-start w-full">
                              <div className="flex items-center justify-between w-full">
                                <span>{quality.label}</span>
                                {videoQuality === quality.value && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <span className="text-xs text-gray-500">{quality.description}</span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  onClick={toggleFullscreen}
                  title="Fullscreen"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Desktop Layout */}
            {!isFloating && (
              <div className="hidden sm:flex items-center gap-3 lg:gap-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-9 w-9 lg:h-10 lg:w-10 p-0"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 lg:h-5 lg:w-5" />
                    ) : (
                      <Play className="h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-9 w-9 lg:h-10 lg:w-10 p-0"
                    onClick={skipBackward}
                  >
                    <SkipBack className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-9 w-9 lg:h-10 lg:w-10 p-0"
                    onClick={skipForward}
                  >
                    <SkipForward className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-9 w-9 lg:h-10 lg:w-10 p-0"
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4 lg:h-5 lg:w-5" />
                    ) : (
                      <Volume2 className="h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                  </Button>
                  <div className="w-16 sm:w-20 lg:w-24">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-full [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&>span:first-child]:h-1"
                    />
                  </div>
                </div>

                <div className="flex-1" />

                <div className="text-sm lg:text-base text-white font-medium whitespace-nowrap px-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-9 w-9 lg:h-10 lg:w-10 p-0"
                    onClick={toggleFloating}
                    title="Picture in Picture"
                  >
                    <Move className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20 h-9 w-9 lg:h-10 lg:w-10 p-0"
                      >
                        <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white" align="end">
                      <DropdownMenuLabel className="text-gray-300">Video Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="text-white hover:bg-gray-800">
                          <div className="flex items-center justify-between w-full">
                            <span>Playback Speed</span>
                            <span className="text-sm text-gray-400">{playbackSpeed}x</span>
                          </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="bg-gray-900 border-gray-700">
                          {playbackSpeeds.map((speed) => (
                            <DropdownMenuItem
                              key={speed.value}
                              onClick={() => handleSpeedChange(speed.value)}
                              className={`text-white hover:bg-gray-800 cursor-pointer ${
                                playbackSpeed === speed.value ? "bg-purple-600" : ""
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{speed.label}</span>
                                {playbackSpeed === speed.value && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="text-white hover:bg-gray-800">
                          <div className="flex items-center justify-between w-full">
                            <span>Quality</span>
                            <span className="text-sm text-gray-400">{videoQuality}</span>
                          </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="bg-gray-900 border-gray-700">
                          {videoQualities.map((quality) => (
                            <DropdownMenuItem
                              key={quality.value}
                              onClick={() => handleQualityChange(quality.value)}
                              className={`text-white hover:bg-gray-800 cursor-pointer ${
                                videoQuality === quality.value ? "bg-purple-600" : ""
                              }`}
                            >
                              <div className="flex flex-col items-start w-full">
                                <div className="flex items-center justify-between w-full">
                                  <span>{quality.label}</span>
                                  {videoQuality === quality.value && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="text-xs text-gray-500">{quality.description}</span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-9 w-9 lg:h-10 lg:w-10 p-0"
                    onClick={toggleFullscreen}
                    title="Fullscreen"
                  >
                    <Maximize className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Placeholder when video is floating */}
      {isFloating && (
        <div className="aspect-video bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Move className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Video player is floating</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={toggleFloating}
            >
              Return to Normal View
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ModernCourseSidebar({ course, onLessonSelect }) {
  const courseData = course || {
    title: "Poi Spinning Fundamentals",
    instructor: "Maya Chen",
    rating: 4.9,
    students: 1247,
    progress: 75,
    completedLessons: 2,
    totalLessons: 18,
    lessons: [
      { id: 1, title: "Welcome to Poi Spinning", duration: "8:30", completed: true },
      { id: 2, title: "Choosing Your First Poi", duration: "12:15", completed: true },
      { id: 3, title: "Basic Stalls and Holds", duration: "15:45", completed: false, current: true },
      { id: 4, title: "Forward and Backward Weaves", duration: "18:20", completed: false },
      { id: 5, title: "Butterfly Pattern Basics", duration: "16:55", completed: false },
      { id: 6, title: "Introduction to Flowers", duration: "22:10", completed: false },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <BookOpen className="h-3 w-3 text-white" />
          </div>
          <span className="font-semibold text-gray-100">Course Content</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Overall Progress</span>
            <span className="font-semibold text-purple-400">{courseData.progress}%</span>
          </div>
          <Progress value={courseData.progress} className="h-3 bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
              style={{ width: `${courseData.progress}%` }}
            />
          </Progress>
        </div>

        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-300">{courseData.completedLessons || 0}</span> of{" "}
          <span className="font-medium text-gray-300">
            {courseData.totalLessons || courseData.lessons?.length || 0}
          </span>{" "}
          lessons completed
        </p>
      </div>

      <div className="space-y-3">
        {courseData.lessons?.map((lesson, index) => (
          <div
            key={lesson.id}
            className={`group flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
              lesson.current
                ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700 shadow-sm"
                : "hover:bg-gray-800/50"
            }`}
            onClick={() => onLessonSelect && onLessonSelect(lesson, index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onLessonSelect && onLessonSelect(lesson, index)
              }
            }}
          >
            <div className="flex-shrink-0">
              {lesson.completed ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              ) : lesson.current ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <Play className="h-3 w-3 text-white" />
                </div>
              ) : (
                <Circle className="h-6 w-6 text-gray-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {lesson.current && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">Current</Badge>
                )}
              </div>
              <div className="text-sm font-medium text-gray-100 mb-1 line-clamp-2">{lesson.title}</div>
              <div className="text-xs text-gray-500">{lesson.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ModernCourseDetail({ onBackClick, course }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [notes, setNotes] = useState("")
  const [currentLesson, setCurrentLesson] = useState(null)

  // Generate dynamic lesson data based on the course
  const generateLessonsForCourse = (course) => {
    if (!course) return []

    const lessonTemplates = {
      "Poi Spinning Fundamentals": [
        {
          id: 1,
          title: "Welcome to Poi Spinning",
          duration: "8:30",
          description: "An introduction to the art of poi spinning and its history.",
        },
        {
          id: 2,
          title: "Choosing Your First Poi",
          duration: "12:15",
          description: "Learn about different types of poi and how to select the right one for beginners.",
        },
        {
          id: 3,
          title: "Basic Stalls and Holds",
          duration: "15:45",
          description: "Master the fundamental stalls and holds that form the foundation of poi spinning.",
        },
        {
          id: 4,
          title: "Forward and Backward Weaves",
          duration: "18:20",
          description: "Learn the essential weaving patterns that create beautiful flow.",
        },
        {
          id: 5,
          title: "Butterfly Pattern Basics",
          duration: "16:55",
          description: "Discover the butterfly pattern, one of the most iconic poi movements.",
        },
        {
          id: 6,
          title: "Introduction to Flowers",
          duration: "22:10",
          description: "Explore flower patterns that add complexity and beauty to your flow.",
        },
      ],
      "Fire Staff Mastery": [
        {
          id: 1,
          title: "Fire Safety Fundamentals",
          duration: "20:30",
          description: "Essential safety protocols for working with fire props.",
        },
        {
          id: 2,
          title: "Staff Selection and Preparation",
          duration: "15:45",
          description: "How to choose and prepare your fire staff for optimal performance.",
        },
        {
          id: 3,
          title: "Basic Fire Staff Spins",
          duration: "18:20",
          description: "Learn the foundational spinning techniques with fire staff.",
        },
        {
          id: 4,
          title: "Advanced Spinning Techniques",
          duration: "22:15",
          description: "Take your skills to the next level with complex patterns.",
        },
        {
          id: 5,
          title: "Fire Staff Transitions",
          duration: "19:40",
          description: "Master smooth transitions between different fire staff movements.",
        },
        {
          id: 6,
          title: "Performance and Safety",
          duration: "25:10",
          description: "Prepare for performing with fire staff safely and confidently.",
        },
      ],
      "Contact Ball Basics": [
        {
          id: 1,
          title: "Introduction to Contact Ball",
          duration: "10:30",
          description: "Discover the meditative art of contact ball manipulation.",
        },
        {
          id: 2,
          title: "Basic Ball Manipulation",
          duration: "14:20",
          description: "Learn fundamental techniques for controlling the ball.",
        },
        {
          id: 3,
          title: "Body Rolls and Isolations",
          duration: "16:45",
          description: "Master rolling the ball across different parts of your body.",
        },
        {
          id: 4,
          title: "Advanced Contact Techniques",
          duration: "18:30",
          description: "Explore complex movements and combinations.",
        },
      ],
      "Rope Dart Fundamentals": [
        {
          id: 1,
          title: "Rope Dart History and Safety",
          duration: "12:15",
          description: "Learn about this ancient Chinese martial arts weapon and safety practices.",
        },
        {
          id: 2,
          title: "Basic Grip and Stance",
          duration: "15:30",
          description: "Master the proper way to hold and position yourself with the rope dart.",
        },
        {
          id: 3,
          title: "Fundamental Movements",
          duration: "18:45",
          description: "Learn the essential movements that form the basis of rope dart flow.",
        },
        {
          id: 4,
          title: "Wrapping Techniques",
          duration: "20:20",
          description: "Discover how to wrap the rope around your body safely and effectively.",
        },
        {
          id: 5,
          title: "Advanced Patterns",
          duration: "22:40",
          description: "Explore complex patterns that showcase your mastery of the rope dart.",
        },
      ],
      "Hoop Dance Flow": [
        {
          id: 1,
          title: "Hoop Selection and Basics",
          duration: "11:20",
          description: "Choose the right hoop and learn fundamental movements.",
        },
        {
          id: 2,
          title: "On-Body Movements",
          duration: "16:30",
          description: "Master techniques for flowing with the hoop on your body.",
        },
        {
          id: 3,
          title: "Off-Body Techniques",
          duration: "18:15",
          description: "Learn to manipulate the hoop in space with control and grace.",
        },
        {
          id: 4,
          title: "Flow and Transitions",
          duration: "20:45",
          description: "Combine movements into a seamless, expressive flow practice.",
        },
      ],
      "Juggling Journey": [
        {
          id: 1,
          title: "Juggling Fundamentals",
          duration: "9:30",
          description: "Learn the basics of juggling with one, two, and three balls.",
        },
        {
          id: 2,
          title: "Three Ball Cascade",
          duration: "14:20",
          description: "Master the classic three-ball juggling pattern.",
        },
        {
          id: 3,
          title: "Advanced Patterns",
          duration: "17:40",
          description: "Explore complex juggling patterns and variations.",
        },
        {
          id: 4,
          title: "Performance Skills",
          duration: "15:50",
          description: "Develop showmanship and performance techniques for juggling.",
        },
      ],
    }

    const lessons = lessonTemplates[course.title] || []

    if (lessons.length === 0) return []

    // Calculate which lessons are completed and which is current based on progress
    const completedCount = Math.floor((course.progress / 100) * lessons.length)
    const currentIndex = Math.min(completedCount, lessons.length - 1)

    return lessons.map((lesson, index) => ({
      ...lesson,
      completed: index < completedCount,
      current: index === currentIndex,
    }))
  }

  // Use the passed course data or fall back to default
  const courseData = course || {
    title: "Poi Spinning Fundamentals",
    instructor: "Maya Chen",
    rating: 4.9,
    students: 1247,
    progress: 75,
    completedLessons: 2,
    totalLessons: 18,
    currentLesson: {
      id: 3,
      title: "Basic Stalls and Holds",
      duration: "15:45",
      description:
        "Learn the fundamental stalls and holds that form the foundation of poi spinning. Master proper hand positioning, timing, and muscle memory for clean transitions.",
    },
    resources: [
      { name: `${course?.title || "Course"} Practice Guide`, size: "2.3 MB", type: "pdf" },
      { name: "Safety Guidelines", size: "1.1 MB", type: "pdf" },
      { name: "Equipment Guide", size: "850 KB", type: "pdf" },
    ],
  }

  // Generate lessons for this course - Memoized to prevent recreation
  const lessons = useMemo(() => generateLessonsForCourse(course), [course?.title, course.progress])

  // Find the current lesson
  useEffect(() => {
    if (course) {
      const generatedLessons = generateLessonsForCourse(course)
      if (generatedLessons && generatedLessons.length > 0) {
        const current = generatedLessons.find((lesson) => lesson.current) || generatedLessons[0]

        // Create a complete lesson object with course information
        const selectedLesson = {
          ...current,
          courseName: courseData.title,
          instructor: courseData.instructor,
        }

        setCurrentLesson(selectedLesson)
      }
    }
  }, [course?.title, course]) // Only depend on course title and progress, not the entire lessons array

  const handleLessonSelect = (lesson, index) => {
    // Create a complete lesson object with course information
    const selectedLesson = {
      ...lesson,
      courseName: courseData.title,
      instructor: courseData.instructor,
    }

    // Update the current lesson
    setCurrentLesson(selectedLesson)

    // Update the lessons array to mark this as the current lesson
    const updatedLessons = lessons.map((l, i) => ({
      ...l,
      current: i === index,
    }))

    // Update the active tab to overview to show the lesson details
    setActiveTab("overview")
  }

  const dynamicCourseData = {
    ...courseData,
    title: course?.title || courseData.title,
    instructor: course?.instructor || courseData.instructor,
    rating: course?.rating || courseData.rating,
    students: course?.students || courseData.students,
    progress: course?.progress || courseData.progress,
    lessons: lessons,
    completedLessons: lessons.filter((l) => l.completed).length,
    totalLessons: lessons.length,
    currentLesson:
      currentLesson ||
      (lessons && lessons.length > 0 ? lessons.find((l) => l.current) || lessons[0] : courseData.currentLesson),
    resources: [
      { name: `${course?.title || "Course"} Practice Guide`, size: "2.3 MB", type: "pdf" },
      { name: "Safety Guidelines", size: "1.1 MB", type: "pdf" },
      { name: "Equipment Guide", size: "850 KB", type: "pdf" },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Enhanced Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-800 text-gray-300" onClick={onBackClick}>
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Courses</span>
            </Button>
            <div>
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {dynamicCourseData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-sm text-gray-500">
                <span>
                  by <span className="font-medium text-gray-300">{dynamicCourseData.instructor}</span>
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{dynamicCourseData.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{dynamicCourseData.students.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base lg:text-lg font-bold text-purple-400">{dynamicCourseData.progress}% Complete</div>
            <div className="text-xs text-gray-500">Keep going!</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Sidebar */}
        <div className="lg:hidden border-b border-gray-800 p-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-gray-900/80 backdrop-blur-sm border-gray-700 text-gray-100 hover:bg-gray-800"
              >
                <Menu className="h-4 w-4" />
                Course Content
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-6 bg-gray-950 border-gray-800">
              <ModernCourseSidebar course={dynamicCourseData} onLessonSelect={handleLessonSelect} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 border-r border-gray-800 bg-gray-950/50 backdrop-blur-sm p-6">
          <ModernCourseSidebar course={dynamicCourseData} onLessonSelect={handleLessonSelect} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="p-4 lg:p-6">
            <ModernVideoPlayer currentLesson={currentLesson} />
          </div>

          {/* Enhanced Content Tabs */}
          <div className="p-4 lg:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                <TabsTrigger
                  value="overview"
                  className="text-xs lg:text-sm data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:text-gray-100 text-gray-400"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="text-xs lg:text-sm data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:text-gray-100 text-gray-400"
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="text-xs lg:text-sm data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:text-gray-100 text-gray-400"
                >
                  Resources
                </TabsTrigger>
                <TabsTrigger
                  value="community"
                  className="text-xs lg:text-sm data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:text-gray-100 text-gray-400"
                >
                  Community
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="border-0 bg-gray-900/80 backdrop-blur-sm shadow-lg border border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                        <BookOpen className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-100">{currentLesson?.title || "Select a lesson"}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-400 leading-relaxed">
                      {currentLesson?.description || "No description available."}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-3 text-gray-100">What you'll learn in this lesson:</h4>
                      <ul className="space-y-2 text-gray-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Basic techniques and proper form</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Timing and rhythm for smooth transitions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Common mistakes and how to avoid them</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Practice exercises to build muscle memory</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card className="border-0 bg-gray-900/80 backdrop-blur-sm shadow-lg border border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                        <BookOpen className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-100">My Notes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Take notes while learning... Your thoughts, key points, questions, or practice reminders."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-32 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-100 placeholder:text-gray-400"
                    />
                    <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Save Notes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <Card className="border-0 bg-gray-900/80 backdrop-blur-sm shadow-lg border border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
                        <Download className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-100">Course Resources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dynamicCourseData.resources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                            <Download className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-100">{resource.name}</p>
                            <p className="text-sm text-gray-400">
                              {resource.size} • {resource.type.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-purple-500"
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="community" className="mt-6">
                <Card className="border-0 bg-gray-900/80 backdrop-blur-sm shadow-lg border border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
                        <Users className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-100">Community Discussion</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      Join the community to share your progress, ask questions, and connect with fellow learners.
                    </p>
                    <Button className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                      Join the Discussion
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
