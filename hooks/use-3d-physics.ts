// hooks/use-3d-physics.ts
import { useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

export function use3DPhysics() {
  const shouldReduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // جعل الحركة ناعمة وارتدادية
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })

  // تحويل حركة الماوس إلى زوايا دوران
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return 
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return {
    handleMouseMove,
    handleMouseLeave,
    rotateX: shouldReduceMotion ? 0 : rotateX,
    rotateY: shouldReduceMotion ? 0 : rotateY,
    shouldReduceMotion
  }
}