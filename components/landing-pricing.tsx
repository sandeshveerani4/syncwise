import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon } from "@radix-ui/react-icons"

export function LandingPricing() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that's right for your team. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>Perfect for small teams just getting started.</CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">$9</span>
                <span className="ml-1 text-muted-foreground">/month per user</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>GitHub & Slack integration</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Basic AI automation</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Up to 5 team members</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          <Card className="border-primary">
            <CardHeader>
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-4">
                Most Popular
              </div>
              <CardTitle>Professional</CardTitle>
              <CardDescription>Ideal for growing teams with advanced needs.</CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">$19</span>
                <span className="ml-1 text-muted-foreground">/month per user</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>All Starter features</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Jira & Google Calendar integration</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Advanced AI automation</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Up to 20 team members</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For large organizations with custom requirements.</CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>All Professional features</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Advanced security & compliance</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
