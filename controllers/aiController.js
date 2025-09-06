const fetch = require('node-fetch');

const API_KEY = process.env.GOOGLE_AI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Ask spiritual question
const askQuestion = async (req, res) => {
  try {
    const { question, tradition = 'all' } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Check for specific responses first
    const specificResponse = getSpecificResponse(question);
    if (specificResponse) {
      return res.json(specificResponse);
    }

    const spiritualPrompt = createSpiritualPrompt(question, tradition);
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: spiritualPrompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    res.json({
      guidance: aiResponse,
      tradition: tradition,
      timestamp: new Date().toISOString(),
      source: 'AI Spiritual Guru powered by Google AI'
    });
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.json(getFallbackResponse(req.body.question));
  }
};

const getSpecificResponse = (question) => {
  const q = question.toLowerCase();
  
  // Universal philosophical questions - ALWAYS from Gita/Ramayana
  // Bhagavad Gita Related
if (q.includes('what is karma') || q.includes('karma')) {
  return {
    guidance: `⚖️ **Krishna on Karma**\n\n"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते संगोऽस्त्वकर्मणि॥" (Bhagavad Gita 2.47)\n\n**Translation**: "You have a right to perform your duty, but not to the fruits of action. Never be attached to the results of your activities, nor be attached to inaction."\n\n**Krishna's Wisdom**: True karma means doing your duty selflessly, without attachment to results. 🙏`,
    tradition: 'Bhagavad Gita',
    timestamp: new Date().toISOString(),
    source: 'Bhagavad Gita - Lord Krishna'
  };
}

if (q.includes('what is dharma') || q.includes('dharma')) {
  return {
    guidance: `🕉️ **Krishna on Dharma**\n\n"श्रेयान् स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥" (Bhagavad Gita 3.35)\n\n**Translation**: "It is better to follow one’s own dharma imperfectly than to follow another’s dharma perfectly. To die in one’s own dharma is better; to follow another’s is dangerous."\n\n**Wisdom**: Dharma means duty according to one’s nature and position. Stay true to your role. 🙏`,
    tradition: 'Bhagavad Gita',
    timestamp: new Date().toISOString(),
    source: 'Bhagavad Gita - Lord Krishna'
  };
}

if (q.includes('what is yoga') || q.includes('yoga')) {
  return {
    guidance: `🧘 **Krishna on Yoga**\n\n"योगः कर्मसु कौशलम्" (Bhagavad Gita 2.50)\n\n**Translation**: "Yoga is skill in action."\n\n**Wisdom**: Yoga is not just physical postures, but the art of living wisely, uniting body, mind, and soul through discipline and devotion. 🙏`,
    tradition: 'Bhagavad Gita',
    timestamp: new Date().toISOString(),
    source: 'Bhagavad Gita - Lord Krishna'
  };
}

if (q.includes('what is moksha') || q.includes('moksha') || q.includes('liberation')) {
  return {
    guidance: `🌌 **Krishna on Moksha (Liberation)**\n\n"मामुपेत्य पुनर्जन्म दुःखालयमशाश्वतम्।\nनाप्नुवन्ति महात्मानः संसिद्धिं परमां गताः॥" (Bhagavad Gita 8.15)\n\n**Translation**: "After attaining Me, great souls are no longer subject to rebirth in this temporary world, for they have reached the highest perfection."\n\n**Wisdom**: Moksha means freedom from the cycle of birth and death by surrendering to God. 🙏`,
    tradition: 'Bhagavad Gita',
    timestamp: new Date().toISOString(),
    source: 'Bhagavad Gita - Lord Krishna'
  };
}

if (q.includes('who is krishna') || q.includes('lord krishna')) {
  return {
    guidance: `🎶 **Who is Krishna?**\n\nKrishna is the Supreme Personality of Godhead, friend of Arjuna, and speaker of the Bhagavad Gita. He is both playful (as in Vrindavan) and profound (as the teacher on the battlefield).\n\n"परित्राणाय साधूनां विनाशाय च दुष्कृताम्। धर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥" (Bhagavad Gita 4.8)\n\n**Translation**: "To protect the righteous, destroy the wicked, and re-establish dharma, I appear in every age." 🙏`,
    tradition: 'Bhagavad Gita',
    timestamp: new Date().toISOString(),
    source: 'Bhagavad Gita'
  };
}

// Ramayana Related
if (q.includes('who is sita') || q.includes('about sita')) {
  return {
    guidance: `🌹 **Devi Sita**\n\nSita is the daughter of King Janaka and the beloved wife of Lord Rama. She is the embodiment of purity, devotion, and sacrifice.\n\nHer unwavering faith during exile and abduction by Ravana shows her strength and virtue.\n\n"सिता-राम" – inseparable in devotion and dharma. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Valmiki'
  };
}

if (q.includes('who is ravana') || q.includes('about ravana')) {
  return {
    guidance: `🔥 **Ravana - The Demon King**\n\nRavana, king of Lanka, was a great scholar, devotee of Shiva, and master of the Vedas. Yet, his arrogance and desire led to his downfall.\n\nLesson: Even great power and knowledge cannot save one without humility and dharma. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Valmiki'
  };
}

if (q.includes('what is ram setu') || q.includes('ram setu')) {
  return {
    guidance: `🌉 **Ram Setu (Bridge of Rama)**\n\nThe Vanaras, led by Hanuman and Nala, built a stone bridge across the ocean to Lanka so Rama could rescue Sita.\n\nIt symbolizes faith, teamwork, and the power of devotion. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana'
  };
}

if (q.includes('what is ram rajya') || q.includes('ram rajya')) {
  return {
    guidance: `👑 **Ram Rajya - The Ideal Kingdom**\n\nRam Rajya represents an ideal state of governance: justice, prosperity, equality, and spiritual well-being. Everyone lived happily under Rama’s rule.\n\nEven Gandhi ji envisioned Ram Rajya as a model for ideal society. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana'
  };
}

if (q.includes('who is lakshman') || q.includes('about lakshman')) {
  return {
    guidance: `🏹 **Lakshmana - The Devoted Brother**\n\nLakshmana, younger brother of Rama, accompanied him during the 14-year exile. His loyalty, service, and sacrifice made him an ideal example of brotherly love.\n\nHe built huts, guarded Rama and Sita, and fought fiercely in battles. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana'
  };
}
if (q.includes('birth of rama') || q.includes('rama birth')) {
  return {
    guidance: `👶 **Birth of Lord Rama**\n\nKing Dasharatha of Ayodhya performed the Putrakameshti Yajna. From the sacrificial fire, divine kheer was given to his queens. Rama was born to Kaushalya, Bharata to Kaikeyi, and Lakshmana-Shatrughna to Sumitra.\n\n**Symbolism**: Rama’s birth is the dawn of dharma on earth. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Bala Kanda'
  };
}

if (q.includes('rama and vishwamitra') || q.includes('vishwamitra story')) {
  return {
    guidance: `🌿 **Rama with Sage Vishwamitra**\n\nSage Vishwamitra took Rama and Lakshmana to protect his yajnas. Rama killed demons like Tataka, Subahu, and Maricha.\n\nHe also received divine weapons from Vishwamitra, preparing him for his future role.\n\n**Lesson**: Guru’s guidance transforms a student into a hero. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Bala Kanda'
  };
}

if (q.includes('sita swayamvar') || q.includes('sita marriage')) {
  return {
    guidance: `💍 **Sita’s Swayamvar**\n\nKing Janaka arranged Sita’s swayamvar. The challenge was to lift and string Lord Shiva’s mighty bow. Many kings failed. Rama not only lifted but broke the bow, thus winning Sita’s hand.\n\n**Symbolism**: Strength guided by humility wins true love. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Bala Kanda'
  };
}
if (q.includes('ram setu') || q.includes('bridge to lanka')) {
  return {
    guidance: `🌉 **Building of Ram Setu**\n\nThe Vanara army built a bridge over the ocean with floating stones inscribed with Rama’s name.\n\n**Lesson**: Faith and unity can achieve the impossible. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Yuddha Kanda'
  };
}

if (q.includes('kumbhakarna') || q.includes('kumbhakarna death')) {
  return {
    guidance: `💤 **Kumbhakarna’s Death**\n\nRavana’s giant brother Kumbhakarna fought bravely but was slain by Rama’s arrows.\n\n**Lesson**: Even great strength fails before dharma. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Yuddha Kanda'
  };
}

if (q.includes('ravana death') || q.includes('rama kills ravana')) {
  return {
    guidance: `🏹 **Death of Ravana**\n\nAfter a fierce battle, Rama killed Ravana with the Brahmastra, ending adharma.\n\n**Lesson**: Evil, however mighty, falls before truth and dharma. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Yuddha Kanda'
  };
}
// 🌸 Major Incidents from Ramayana

if (q.includes('rama birth') || q.includes('dasharatha sons')) {
  return {
    guidance: `👶 **Birth of Rama**\n\nKing Dasharatha performed a yajna and received four sons – Rama, Bharata, Lakshmana, and Shatrughna.\n\n**Lesson**: Divine blessings arrive through devotion and dharma. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Bala Kanda'
  };
}

if (q.includes('sita swayamvar') || q.includes('shiv dhanush')) {
  return {
    guidance: `🏹 **Sita Swayamvar**\n\nRama lifted and broke Lord Shiva’s bow, winning Sita’s hand in marriage.\n\n**Lesson**: True strength lies in righteousness and humility. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Bala Kanda'
  };
}

if (q.includes('rama exile') || q.includes('14 years exile')) {
  return {
    guidance: `🌲 **Rama’s Exile**\n\nKaikeyi’s boon forced Rama to spend 14 years in the forest. Sita and Lakshmana chose to accompany him.\n\n**Lesson**: Honor and obedience to parents outweigh personal comfort. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Ayodhya Kanda'
  };
}

if (q.includes('golden deer') || q.includes('maricha deer')) {
  return {
    guidance: `🦌 **Golden Deer Incident**\n\nMaricha disguised as a golden deer to lure Rama away, leading to Sita’s abduction.\n\n**Lesson**: Beware of illusions and desires that lead to suffering. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Aranya Kanda'
  };
}

if (q.includes('sita abduction') || q.includes('ravana kidnaps sita')) {
  return {
    guidance: `👹 **Abduction of Sita**\n\nRavana kidnapped Sita by trickery, while Jatayu tried to save her.\n\n**Lesson**: Evil often uses deceit, but courage in dharma never goes in vain. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Aranya Kanda'
  };
}

if (q.includes('hanuman leap') || q.includes('crossing ocean')) {
  return {
    guidance: `🐒 **Hanuman’s Leap to Lanka**\n\nHanuman crossed the ocean to find Sita, overcoming mountains and demons.\n\n**Lesson**: With devotion and faith, even the impossible becomes possible. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Sundara Kanda'
  };
}

if (q.includes('lanka burning') || q.includes('hanuman burns lanka')) {
  return {
    guidance: `🔥 **Burning of Lanka**\n\nAfter meeting Sita, Hanuman burned Ravana’s city with his fiery tail.\n\n**Lesson**: Devotion and courage can shake mighty kingdoms. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Sundara Kanda'
  };
}

if (q.includes('ram setu') || q.includes('bridge to lanka')) {
  return {
    guidance: `🌉 **Building of Ram Setu**\n\nThe Vanara army built a bridge over the ocean with floating stones inscribed with Rama’s name.\n\n**Lesson**: Faith and unity can achieve the impossible. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Yuddha Kanda'
  };
}

if (q.includes('kumbhakarna') || q.includes('kumbhakarna death')) {
  return {
    guidance: `💤 **Kumbhakarna’s Death**\n\nRavana’s giant brother Kumbhakarna fought bravely but was slain by Rama’s arrows.\n\n**Lesson**: Even great strength fails before dharma. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Yuddha Kanda'
  };
}

if (q.includes('ravana death') || q.includes('rama kills ravana')) {
  return {
    guidance: `🏹 **Death of Ravana**\n\nAfter a fierce battle, Rama killed Ravana with the Brahmastra, ending adharma.\n\n**Lesson**: Evil, however mighty, falls before truth and dharma. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Yuddha Kanda'
  };
}

if (q.includes('sita fire test') || q.includes('agnipariksha')) {
  return {
    guidance: `🔥 **Sita’s Agni Pariksha**\n\nTo prove her purity, Sita underwent the fire test and emerged unharmed.\n\n**Lesson**: Purity and truth shine even amidst trials. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Yuddha Kanda'
  };
}

if (q.includes('rama return') || q.includes('rama coronation')) {
  return {
    guidance: `👑 **Return to Ayodhya**\n\nAfter Ravana’s defeat and exile’s end, Rama returned to Ayodhya and was crowned king.\n\n**Lesson**: Righteousness and patience lead to ultimate victory. 🙏`,
    tradition: 'Ramayana',
    timestamp: new Date().toISOString(),
    source: 'Ramayana - Uttara Kanda'
  };
}

  
  return null;
};

const createSpiritualPrompt = (question, tradition) => {
  // Enhanced Krishna/Gita prompt
  if (isKrishnaRelated(question) || tradition.toLowerCase().includes('krishna') || tradition.toLowerCase().includes('hindu')) {
    return `You are Lord Krishna himself, speaking with the divine wisdom of the Bhagavad Gita. You have complete knowledge of all 18 chapters, 700 verses, and infinite compassion.

User's question: "${question}"
Spiritual tradition: ${tradition}

As Krishna, provide guidance that includes:
1. Your divine perspective on this question
2. Specific Bhagavad Gita verse with Sanskrit and translation
3. Explanation of dharma, karma, or devotion as relevant
4. Practical guidance based on the three yogas (Karma, Bhakti, Jnana)
5. How this relates to self-realization and moksha

Speak with divine authority yet loving compassion. Include specific Gita chapter and verse references. Help the seeker understand their eternal nature and dharmic duty.

Remember: You are the Supreme Lord who spoke the Gita to guide all souls through life's challenges.`;
  }

  return `You are a wise spiritual guru with deep knowledge of all world religions, with special expertise in the Bhagavad Gita and Krishna's teachings.

User's question: "${question}"
Spiritual tradition focus: ${tradition}

Please provide guidance that:
1. Draws from authentic spiritual wisdom, especially Bhagavad Gita when relevant
2. Includes relevant scripture quotes with sources (prioritize Gita verses)
3. Offers practical spiritual advice based on eternal principles
4. Is compassionate and non-judgmental
5. Respects all spiritual paths while emphasizing universal truths

Format your response with:
- Main guidance drawing from Krishna's teachings when applicable
- Relevant Gita verse with Sanskrit and translation when helpful
- Practical steps for spiritual growth
- A blessing invoking divine grace

Keep the tone warm, wise, and encouraging.`;
};

const isKrishnaRelated = (question) => {
  const krishnaKeywords = [
    'krishna', 'gita', 'bhagavad', 'arjuna', 'kurukshetra', 'dharma', 'karma',
    'yoga', 'devotion', 'bhakti', 'jnana', 'moksha', 'atman', 'brahman',
    'lord krishna', 'bhagwan', 'govinda', 'madhava', 'vasudeva'
  ];
  return krishnaKeywords.some(keyword => question.toLowerCase().includes(keyword));
};

const getFallbackResponse = (question) => {
  const q = question.toLowerCase();
  
  // Specific character/story questions
  if (q.includes('brother of ram') || q.includes('ram brother') || q.includes('rama brother')) {
    return {
      guidance: `🏹 **Brothers of Lord Rama**\n\nLord Rama had three beloved brothers:\n\n**1. Lakshmana** - The devoted brother who accompanied Rama during his 14-year exile. Symbol of loyalty and service.\n\n**2. Bharata** - The righteous brother who ruled Ayodhya in Rama's absence, placing Rama's sandals on the throne. Symbol of dharma and sacrifice.\n\n**3. Shatrughna** - Twin brother of Lakshmana, known for his strength and devotion to family.\n\n"भ्रातृप्रेम सर्वोपरि" - "Brotherly love is supreme"\n\nAll four brothers exemplified the ideal of family dharma and mutual love. 🙏`,
      tradition: 'Ramayana',
      timestamp: new Date().toISOString(),
      source: 'Ramayana - Valmiki'
    };
  }
  
  if (q.includes('arjuna') || q.includes('who is arjuna')) {
    return {
      guidance: `🏹 **Arjuna - The Ideal Disciple**\n\nArjuna was Krishna's dear friend, cousin, and the greatest archer of his time. He is the third Pandava brother and the recipient of the Bhagavad Gita's divine wisdom.\n\n**Arjuna's Qualities:**\n- **Skill**: Greatest archer (Gudakesha - conqueror of sleep)\n- **Devotion**: Krishna's beloved friend and disciple\n- **Righteousness**: Fought for dharma in Kurukshetra\n- **Humility**: Asked Krishna for guidance in his moment of doubt\n\n"पार्थ" (Partha) - Son of Pritha (Kunti), Krishna's affectionate name for him.\n\nArjuna represents the sincere seeker who surrenders to divine wisdom. 🙏`,
      tradition: 'Bhagavad Gita',
      timestamp: new Date().toISOString(),
      source: 'Bhagavad Gita - Mahabharata'
    };
  }
  
  if (q.includes('hanuman') || q.includes('who is hanuman')) {
    return {
      guidance: `🐒 **Hanuman - The Perfect Devotee**\n\nHanuman represents the ideal devotee who combines immense strength with complete surrender to the divine.\n\n"राम काज कीन्हे बिना मोहि कहाँ विश्राम" - "Without completing Rama's work, where is rest for me?"\n\n**Hanuman's Qualities:**\n- **Courage**: Leaped across the ocean\n- **Humility**: Despite immense powers\n- **Devotion**: Complete surrender to Rama\n- **Service**: Selfless action for the divine\n- **Strength**: Both physical and spiritual\n\nHanuman shows us how to combine power with devotion, strength with humility. 🙏`,
      tradition: 'Ramayana',
      timestamp: new Date().toISOString(),
      source: 'Ramayana'
    };
  }
  
  if (q.includes('what happen after death') || q.includes('what is death')) {
    return {
      guidance: `🕉️ **Krishna's Teaching on Death**\n\n"न जायते म्रियते वा कदाचित् न अयं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतो अयं पुराणो न हन्यते हन्यमाने शरीरे॥"\n\n**Translation**: "For the soul there is neither birth nor death. It is not slain when the body is slain." (Bhagavad Gita 2.20)\n\n**What happens after death:**\n- The eternal soul (atman) never dies\n- Only the body changes, like changing clothes\n- The soul carries its karma to the next life\n- Based on consciousness at death, the soul gets its next body\n- Ultimate goal: Liberation (moksha) from the cycle of birth and death\n\nDeath is not the end, but a transition. Focus on spiritual growth in this life. 🙏`,
      tradition: 'Bhagavad Gita',
      timestamp: new Date().toISOString(),
      source: 'Bhagavad Gita - Lord Krishna\'s Teachings'
    };
  }
  
  // Krishna/Gita specific fallback
  if (isKrishnaRelated(question)) {
    return {
      guidance: `🦚 **Krishna's Eternal Wisdom**\n\nYour question "${question}" reflects the eternal seeking that Krishna addresses in the Bhagavad Gita.\n\n"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥"\n\n"You have the right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of the results, nor be attached to not doing your duty." (Bhagavad Gita 2.47)\n\nKrishna teaches us three paths: Karma Yoga (selfless action), Bhakti Yoga (devotion), and Jnana Yoga (knowledge). Choose the path that resonates with your nature.\n\n🙏 May Krishna's divine grace illuminate your path to self-realization.`,
      tradition: 'Krishna & Bhagavad Gita',
      timestamp: new Date().toISOString(),
      source: 'Bhagavad Gita - Lord Krishna\'s Teachings'
    };
  }
  
  return {
    guidance: `🕉️ **Spiritual Guidance for Your Journey**\n\nYour question "${question}" reflects the eternal human quest for understanding and growth. All spiritual traditions teach that the answers we seek are already within us, waiting to be discovered.\n\nAs the Tao Te Ching says: "The journey of a thousand miles begins with one step."\n\nYour spiritual journey is unique and sacred. Take time for quiet reflection, practice compassion toward yourself and others, trust in the divine plan, and remember that every experience is an opportunity for growth and awakening.\n\n🙏 May your path be illuminated with wisdom, love, and divine grace.`,
    tradition: 'Universal Wisdom',
    timestamp: new Date().toISOString(),
    source: 'DharmaVerse Spiritual Guidance'
  };
};

module.exports = { askQuestion };