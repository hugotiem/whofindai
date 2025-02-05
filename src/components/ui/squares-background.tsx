"use client"

import React from "react"
import { useEffect, useRef, useCallback } from "react"

interface SquaresProps {
  direction?: "diagonal" | "horizontal" | "vertical"
  speed?: number
  squareSize?: number
  borderColor?: string
  hoverFillColor?: string
  className?: string
}

export function Squares({
  direction = "diagonal",
  speed = 1,
  squareSize = 40,
  borderColor = "#2a2b34",
  // hoverFillColor = "#1a1b24",
  className,
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const offsetRef = useRef({ x: 0, y: 0 })

  // Memoize the draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate grid positions with offset
    const startX = Math.floor(offsetRef.current.x / squareSize) * squareSize
    const startY = Math.floor(offsetRef.current.y / squareSize) * squareSize

    // Draw squares with offset
    ctx.lineWidth = 0.5
    ctx.strokeStyle = borderColor

    for (let x = startX - squareSize; x < canvas.width + squareSize; x += squareSize) {
      for (let y = startY - squareSize; y < canvas.height + squareSize; y += squareSize) {
        const drawX = x - (offsetRef.current.x % squareSize)
        const drawY = y - (offsetRef.current.y % squareSize)
        ctx.strokeRect(drawX, drawY, squareSize, squareSize)
      }
    }

    // Apply gradient overlay
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 2
    )
    gradient.addColorStop(0, "rgba(10, 11, 20, 0)")
    gradient.addColorStop(1, "#0a0b14")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [squareSize, borderColor])

  // Animation loop
  const animate = useCallback(() => {
    const effectiveSpeed = Math.max(speed * 0.5, 0.1)

    // Update offsets based on direction
    if (direction === "diagonal") {
      offsetRef.current.x += effectiveSpeed
      offsetRef.current.y += effectiveSpeed
    } else if (direction === "horizontal") {
      offsetRef.current.x += effectiveSpeed
    } else if (direction === "vertical") {
      offsetRef.current.y += effectiveSpeed
    }

    // Keep offsets within bounds
    offsetRef.current.x %= squareSize
    offsetRef.current.y %= squareSize

    draw()
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [direction, speed, draw, squareSize])

  // Handle canvas resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    draw()
  }, [draw])

  // Setup effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.style.background = "#0a0b14"
    
    // Initial setup
    handleResize()
    window.addEventListener("resize", handleResize)
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [handleResize, animate])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full transform-gpu ${className}`}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    />
  )
}
