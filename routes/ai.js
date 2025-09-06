const express = require('express');
const router = express.Router();

router.post('/ask', async (req, res) => {
  const { question, tradition } = req.body;
  const response = getComprehensiveResponse(question, tradition);
  res.json(response);
});

function getComprehensiveResponse(question, tradition) {
  const q = question.toLowerCase();
  
  // RAMAYANA CHARACTERS
  if (q.includes('ram') && !q.includes('program')) return getRamaResponse(question, tradition);
  if (q.includes('sita')) return getSitaResponse(question, tradition);
  if (q.includes('hanuman')) return getHanumanResponse(question, tradition);
  if (q.includes('ravan') || q.includes('ravana')) return getRavanaResponse(question, tradition);
  if (q.includes('lakshman') || q.includes('laxman')) return getLakshmanResponse(question, tradition);
  if (q.includes('bharat')) return getBharatResponse(question, tradition);
  if (q.includes('dasharath')) return getDasharathResponse(question, tradition);
  if (q.includes('kaikeyi')) return getKaikeyiResponse(question, tradition);
  if (q.includes('jatayu')) return getJatayuResponse(question, tradition);
  if (q.includes('vibhishan')) return getVibhishanResponse(question, tradition);
  if (q.includes('sugriva')) return getSugrivaResponse(question, tradition);
  if (q.includes('vali')) return getValiResponse(question, tradition);
  
  // MAHABHARATA CHARACTERS
  if (q.includes('krishna')) return getKrishnaResponse(question, tradition);
  if (q.includes('arjuna')) return getArjunaResponse(question, tradition);
  if (q.includes('bhishma')) return getBhishmaResponse(question, tradition);
  if (q.includes('drona')) return getDronaResponse(question, tradition);
  if (q.includes('karna')) return getKarnaResponse(question, tradition);
  if (q.includes('duryodhana')) return getDuryodhanaResponse(question, tradition);
  
  // INCIDENTS
  if (q.includes('exile') || q.includes('vanvas')) return getExileResponse(question, tradition);
  if (q.includes('kidnap') || q.includes('haran')) return getSitaKidnapResponse(question, tradition);
  if (q.includes('bridge') || q.includes('setu')) return getBridgeResponse(question, tradition);
  if (q.includes('war') || q.includes('kurukshetra')) return getWarResponse(question, tradition);
  
  // CONCEPTS
  if (q.includes('dharma')) return getDharmaResponse(question, tradition);
  if (q.includes('karma')) return getKarmaResponse(question, tradition);
  if (q.includes('peace')) return getPeaceResponse(question, tradition);
  if (q.includes('love')) return getLoveResponse(question, tradition);
  if (q.includes('death')) return getDeathResponse(question, tradition);
  if (q.includes('gita')) return getGitaResponse(question, tradition);
  if (q.includes('ramayana')) return getRamayanaResponse(question, tradition);
  
  return getUniversalResponse(question, tradition);
}

function getRamaResponse(question, tradition) {
  return {
    guidance: `🏹 Lord Rama - Maryada Purushottama\n\nRama is the seventh avatar of Vishnu, known as the ideal man who never deviated from dharma even in the greatest adversity.\n\n"रघुकुल रीति सदा चली आई, प्राण जाय पर वचन न जाई" - "The tradition of Raghu dynasty has always been that life may go but word should never be broken"\n\nRama's qualities: Perfect son (obeyed parents), ideal husband (loved Sita), just king (cared for subjects), loyal friend (helped Sugriva), and compassionate enemy (gave last rites to Ravana).\n\n🙏 May Rama's example inspire you to choose righteousness over convenience.`,
    tradition: tradition,
    timestamp: new Date().toISOString(),
    source: 'Ramayana'
  };
}

function getSitaResponse(question, tradition) {
  return {
    guidance: `👸 Mata Sita - The Divine Mother\n\nSita, born from Mother Earth, represents purity, patience, devotion, and inner strength. She is the ideal of womanhood in Hindu tradition.\n\n"सीता राम मय सब जग जानी" - "The whole world is pervaded by Sita and Rama"\n\nSita's trials: Chose forest over palace, maintained purity in Lanka, proved chastity through Agni Pariksha, and finally returned to Mother Earth when questioned again.\n\n🙏 May Sita's example inspire purity of heart and strength in adversity.`,
    tradition: tradition,
    timestamp: new Date().toISOString(),
    source: 'Ramayana'
  };
}

function getHanumanResponse(question, tradition) {
  return {
    guidance: `🐒 Hanuman - The Perfect Devotee\n\nHanuman represents the ideal devotee who combines immense strength with complete surrender to the divine.\n\n"राम काज कीन्हे बिना मोहि कहाँ विश्राम" - "Without completing Rama's work, where is rest for me?"\n\nHanuman's qualities: Courage (leaped ocean), Humility (despite powers), Devotion (complete surrender), Service (selfless action), and Celibacy (spiritual strength).\n\n🙏 May Hanuman's devotion and strength inspire selfless service.`,
    tradition: tradition,
    timestamp: new Date().toISOString(),
    source: 'Ramayana'
  };
}

function getRavanaResponse(question, tradition) {
  return {
    guidance: `👹 Ravana - The Ten-Headed King\n\nRavana was a great scholar, devotee of Shiva, and powerful king, but his ego and desires led to his destruction.\n\n"अहंकार एव नाशस्य कारणम्" - "Pride alone is the cause of destruction"\n\nRavana's ten heads represent: Lust, Anger, Greed, Pride, Jealousy, Mind, Intellect, Will, Ego, and Self-esteem. Despite his knowledge, he violated dharma by kidnapping Sita.\n\n🙏 May we learn to use our talents for dharma, not ego.`,
    tradition: tradition,
    timestamp: new Date().toISOString(),
    source: 'Ramayana'
  };
}

function getKrishnaResponse(question, tradition) {
  return {
    guidance: `🕉️ Lord Krishna - The Divine Teacher\n\nKrishna is the eighth avatar of Vishnu and the teacher of the Bhagavad Gita, representing divine wisdom and love.\n\n"यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥" - "Whenever dharma declines and adharma rises, I manifest myself"\n\nKrishna's teachings in the Gita cover Karma Yoga (selfless action), Bhakti Yoga (devotion), and Jnana Yoga (knowledge) - the three paths to liberation.\n\n🙏 May Krishna's wisdom guide you on the path of dharma.`,
    tradition: tradition,
    timestamp: new Date().toISOString(),
    source: 'Bhagavad Gita'
  };
}

function getArjunaResponse(question, tradition) {
  return {
    guidance: `🏹 Arjuna - The Confused Warrior\n\nArjuna represents every human soul confused about duty and righteousness. His questions led to the Bhagavad Gita.\n\n"कर्तव्यं किम् अकर्तव्यं किम्" - "What should be done and what should not be done?"\n\nArjuna's dilemma: Seeing relatives as enemies on Kurukshetra battlefield, he refused to fight. Krishna's teachings transformed his confusion into clarity.\n\n🙏 May you find clarity in confusion like Arjuna through divine guidance.`,
    tradition: tradition,
    timestamp: new Date().toISOString(),
    source: 'Bhagavad Gita'
  };
}

function getDharmaResponse(question, tradition) {
  return {
    guidance: `⚖️ Dharma - Righteous Duty\n\nDharma is the cosmic law that maintains order in the universe and righteousness in human conduct.\n\n"स्वधर्मे निधनं श्रेयः परधर्मो भयावहः" - "Better is one's own dharma, though imperfectly performed, than another's dharma well performed"\n\nDharma has four pillars: Truth (Satya), Compassion (Daya), Austerity (Tapa), and Charity (Dana). Your dharma is discovered by aligning your talents with service to others.\n\n🙏 May you discover and fulfill your sacred dharma.`,
    tradition: tradition,
    timestamp: new Date().toISOString(),
    source: 'Bhagavad Gita & Ramayana'
  };
}

function getUniversalResponse(question, tradition) {
  return {
    guidance: `🕉️ Sacred Wisdom for Your Journey\n\nYour question "${question}" seeks the eternal truths found in our sacred scriptures. Both Ramayana and Bhagavad Gita offer guidance for every aspect of life.\n\n"सर्वं खल्विदं ब्रह्म" - "All this is indeed Brahman"\n"तत्त्वमसि" - "Thou art That"\n\nWhether through Rama's perfect example or Krishna's divine teachings, both scriptures guide us toward realizing our true divine nature.\n\n🙏 May the combined wisdom of these sacred texts illuminate your path.`,
    tradition: tradition,
    timestamp: new Date().toISOString(),
    source: 'Bhagavad Gita & Ramayana'
  };
}

// Add placeholder functions for other characters
function getLakshmanResponse(q, t) { return getUniversalResponse(q, t); }
function getBharatResponse(q, t) { return getUniversalResponse(q, t); }
function getDasharathResponse(q, t) { return getUniversalResponse(q, t); }
function getKaikeyiResponse(q, t) { return getUniversalResponse(q, t); }
function getJatayuResponse(q, t) { return getUniversalResponse(q, t); }
function getVibhishanResponse(q, t) { return getUniversalResponse(q, t); }
function getSugrivaResponse(q, t) { return getUniversalResponse(q, t); }
function getValiResponse(q, t) { return getUniversalResponse(q, t); }
function getBhishmaResponse(q, t) { return getUniversalResponse(q, t); }
function getDronaResponse(q, t) { return getUniversalResponse(q, t); }
function getKarnaResponse(q, t) { return getUniversalResponse(q, t); }
function getDuryodhanaResponse(q, t) { return getUniversalResponse(q, t); }
function getExileResponse(q, t) { return getUniversalResponse(q, t); }
function getSitaKidnapResponse(q, t) { return getUniversalResponse(q, t); }
function getBridgeResponse(q, t) { return getUniversalResponse(q, t); }
function getWarResponse(q, t) { return getUniversalResponse(q, t); }
function getKarmaResponse(q, t) { return getUniversalResponse(q, t); }
function getPeaceResponse(q, t) { return getUniversalResponse(q, t); }
function getLoveResponse(q, t) { return getUniversalResponse(q, t); }
function getDeathResponse(q, t) { return getUniversalResponse(q, t); }
function getGitaResponse(q, t) { return getUniversalResponse(q, t); }
function getRamayanaResponse(q, t) { return getUniversalResponse(q, t); }

module.exports = router;