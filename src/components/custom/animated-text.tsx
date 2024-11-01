import { motion } from 'framer-motion';

export const AnimatedText = ({ content }: { content: string }) => {
  const text = `La cause la plus probable des requêtes répétitives est une connexion en écoute (listener) créée suite à l'appel de signInWithCustomToken(). Cela pourrait être dû à des règles de Firestore, des fonctionnalités par défaut (comme la persistance), ou des dépendances qui initient des connexions. En analysant ton code pour vérifier s'il y a des listeners implicites et en désactivant les fonctionnalités de persistance si elles ne sont pas nécessaires, tu devrais pouvoir réduire ce type de requêtes en boucle.`;

  // Diviser le texte en phrases (ou en mots si vous voulez une granularité plus fine)
  const textSegments = (content || text).split(' ');

  return (
    <div style={{ fontSize: '1.2em', lineHeight: '1.5em' }}>
      {textSegments.map((segment, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.5 // Décaler chaque segment pour les animer les uns après les autres
          }}
          style={{ display: 'inline-block', marginRight: '8px' }}
        >
          {segment + (index < textSegments.length - 1 ? '. ' : '')}
        </motion.span>
      ))}
    </div>
  );
};
