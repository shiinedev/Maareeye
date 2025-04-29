import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Testimonials() {
  return (
    <div className=" pb-20 py-25 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-title capitalize ">What Our User say</h2>
          <p className=" max-w-2xl mx-auto text-muted-foreground capitalize">
          Real People feedback from real peaple using maareeye to master their money.
          </p>
        </div>

        {/* Grid layout for testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative p-[1px] rounded-md bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 overflow-hidden animate-gradient ">
            <Card className="overflow-hidden dark:bg-zinc-900 border-0 rounded-[7px] ">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10 border ">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.username} />
                      <AvatarFallback>{testimonial.username.substring(1, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="">{testimonial.username}</span>
                  </div>
                </div>
                <p className=" text-sm leading-relaxed text-muted-foreground">{testimonial.content}</p>
                {testimonial.source && <div className="mt-4 text-xs ">{testimonial.source}</div>}
              </CardContent>
            </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const testimonials = [
  {
    username: "@Mchamouda",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
    "“I look forward to my monthly finance report—it’s beautiful and concise. Truly game-changing.”",

  },
  {
    username: "@sharafdin",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      '“Maareeye transformed the way I handle my finances. The insights are clear and actionable!”',
  },
  {
    username: "@omar-tood",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "“The AI insights helped me save more and stress less. Maareeye is my go-to finance app!”",
  },
  
]
