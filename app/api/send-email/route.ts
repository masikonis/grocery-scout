import { NextResponse } from 'next/server'
import formData from 'form-data'
import Mailgun from 'mailgun.js'
import type { GroceryDeal } from '@/types'

const API_KEY = process.env.MAILGUN_API_KEY || ''
const DOMAIN = process.env.MAILGUN_DOMAIN || ''
const FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || ''

const mailgun = new Mailgun(formData)
const client = mailgun.client({ username: 'api', key: API_KEY })

function formatDate(): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date())
}

function formatShoppingList(deals: GroceryDeal[]): { text: string; html: string } {
  const storeGroups = deals.reduce((acc, deal) => {
    if (!acc[deal.store]) {
      acc[deal.store] = []
    }
    acc[deal.store].push(deal)
    return acc
  }, {} as Record<string, GroceryDeal[]>)

  let textEmail = ""
  let htmlEmail = ""

  for (const [store, items] of Object.entries(storeGroups)) {
    textEmail += `${store.toUpperCase()}\n\n`
    htmlEmail += `<strong>${store.toUpperCase()}</strong><br><br>`
    
    items.forEach(item => {
      const discountPercent = Math.round((1 - item.price / item.originalPrice) * 100)
      const textLine = `${item.name}: €${item.price} (-${discountPercent}%)\n`
      const htmlLine = `${item.name}: €${item.price} <span style="color: #dc2626">(-${discountPercent}%)</span><br>`
      
      textEmail += textLine
      htmlEmail += htmlLine
    })
    
    textEmail += '\n'
    htmlEmail += '<br>'
  }

  const total = deals.reduce((sum, deal) => sum + deal.price, 0)
  const totalSavings = deals.reduce((sum, deal) => sum + (deal.originalPrice - deal.price), 0)

  const totalsText = `Total: €${total.toFixed(2)}\nTotal Savings: €${totalSavings.toFixed(2)}`
  const totalsHtml = `<strong>
    Total: €${total.toFixed(2)}<br>
    <span style="color: #dc2626">Total Savings: €${totalSavings.toFixed(2)}</span>
  </strong>`

  return {
    text: textEmail + totalsText,
    html: htmlEmail + totalsHtml
  }
}

export async function POST(request: Request) {
  try {
    const { email, deals } = await request.json()
    const { text, html } = formatShoppingList(deals)

    const messageData = {
      from: FROM_EMAIL,
      to: email,
      subject: `Shopping List (${formatDate()})`,
      text: text,  // Plain text fallback
      html: html   // HTML version
    }

    await client.messages.create(DOMAIN, messageData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}