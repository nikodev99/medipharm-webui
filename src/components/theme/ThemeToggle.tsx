import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('theme')
        return (stored === 'light' || stored === 'dark' || stored === 'system')
            ? stored
            : 'system'
    })

    useEffect(() => {
        const root = document.documentElement

        const applyTheme = (newTheme: Theme) => {
            root.classList.remove('light', 'dark')

            if (newTheme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light'
                root.classList.add(systemTheme)
            } else {
                root.classList.add(newTheme)
            }
        }

        applyTheme(theme)
        localStorage.setItem('theme', theme)

        // Listen for system theme changes when in system mode
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

            const handleChange = (e: MediaQueryListEvent) => {
                root.classList.remove('light', 'dark')
                root.classList.add(e.matches ? 'dark' : 'light')
            }

            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
    }, [theme])

    return (
        <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as Theme)}
            className="flex gap-2"
        >
            <div className="flex items-center">
                <RadioGroupItem
                    value="light"
                    id="light"
                    className="peer sr-only"
                />
                <Label
                    htmlFor="light"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                    <Sun className="h-5 w-5" />
                    <span className="sr-only">Light</span>
                </Label>
            </div>

            <div className="flex items-center">
                <RadioGroupItem
                    value="dark"
                    id="dark"
                    className="peer sr-only"
                />
                <Label
                    htmlFor="dark"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                    <Moon className="h-5 w-5" />
                    <span className="sr-only">Dark</span>
                </Label>
            </div>

            <div className="flex items-center">
                <RadioGroupItem
                    value="system"
                    id="system"
                    className="peer sr-only"
                />
                <Label
                    htmlFor="system"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                    <Monitor className="h-5 w-5" />
                    <span className="sr-only">System</span>
                </Label>
            </div>
        </RadioGroup>
    )
}