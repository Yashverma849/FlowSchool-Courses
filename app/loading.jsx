"use client"

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        {/* Rotating Mandala */}
        <div className="mb-8">
          <div className="animate-spin-slow mx-auto">
            <svg 
              width="200" 
              height="200" 
              viewBox="0 0 200 200" 
              className="mx-auto"
            >
              {/* Outer purple petals */}
              <g className="opacity-90">
                {Array.from({ length: 12 }).map((_, i) => (
                  <path
                    key={`outer-${i}`}
                    d={`M 100 100 L ${100 + 80 * Math.cos(i * Math.PI / 6)} ${100 + 80 * Math.sin(i * Math.PI / 6)} 
                        Q ${100 + 70 * Math.cos((i + 0.5) * Math.PI / 6)} ${100 + 70 * Math.sin((i + 0.5) * Math.PI / 6)} 
                        ${100 + 60 * Math.cos((i + 1) * Math.PI / 6)} ${100 + 60 * Math.sin((i + 1) * Math.PI / 6)} Z`}
                    fill={`hsl(${270 + i * 5}, 70%, ${60 + i * 2}%)`}
                    stroke={`hsl(${270 + i * 5}, 80%, ${50 + i * 2}%)`}
                    strokeWidth="1"
                  />
                ))}
              </g>
              
              {/* Middle teal petals */}
              <g className="opacity-80">
                {Array.from({ length: 16 }).map((_, i) => (
                  <path
                    key={`middle-${i}`}
                    d={`M 100 100 L ${100 + 50 * Math.cos(i * Math.PI / 8)} ${100 + 50 * Math.sin(i * Math.PI / 8)} 
                        Q ${100 + 40 * Math.cos((i + 0.5) * Math.PI / 8)} ${100 + 40 * Math.sin((i + 0.5) * Math.PI / 8)} 
                        ${100 + 30 * Math.cos((i + 1) * Math.PI / 8)} ${100 + 30 * Math.sin((i + 1) * Math.PI / 8)} Z`}
                    fill={`hsl(${180 + i * 8}, 70%, ${50 + i * 3}%)`}
                    stroke={`hsl(${180 + i * 8}, 80%, ${40 + i * 3}%)`}
                    strokeWidth="1"
                  />
                ))}
              </g>
              
              {/* Inner blue petals */}
              <g className="opacity-70">
                {Array.from({ length: 20 }).map((_, i) => (
                  <path
                    key={`inner-${i}`}
                    d={`M 100 100 L ${100 + 25 * Math.cos(i * Math.PI / 10)} ${100 + 25 * Math.sin(i * Math.PI / 10)} 
                        Q ${100 + 20 * Math.cos((i + 0.5) * Math.PI / 10)} ${100 + 20 * Math.sin((i + 0.5) * Math.PI / 10)} 
                        ${100 + 15 * Math.cos((i + 1) * Math.PI / 10)} ${100 + 15 * Math.sin((i + 1) * Math.PI / 10)} Z`}
                    fill={`hsl(${200 + i * 10}, 80%, ${60 + i * 2}%)`}
                    stroke={`hsl(${200 + i * 10}, 90%, ${50 + i * 2}%)`}
                    strokeWidth="1"
                  />
                ))}
              </g>
              
              {/* Center spiral */}
              <circle
                cx="100"
                cy="100"
                r="8"
                fill="hsl(180, 90%, 60%)"
                stroke="hsl(180, 100%, 50%)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            FlowSchool
          </h1>
          <p className="text-gray-400 text-lg">
            Preparing your flow journey...
          </p>
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 