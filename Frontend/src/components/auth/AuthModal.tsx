"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import API from "../../services/api"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'login' | 'register'
  onSwitchMode: () => void
}

export function AuthModal({ isOpen, onClose, type, onSwitchMode }: AuthModalProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await API.post(`/users/${type}`, {
        email,
        password,
        name: type === 'register' ? name : undefined,
        rememberMe,
      })

      const data = response.data

      // Store user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);

      onClose()
      navigate(data.user.role === "admin" ? "/admin" : "/vacations")
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type === 'login' ? "Login" : "Register"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            {type === 'login' ? "Login" : "Register"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onSwitchMode}
          >
            {type === 'login' ? "Need an account? Register" : "Already have an account? Login"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 