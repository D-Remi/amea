<?php

namespace App\EventSubscriber;

use App\Entity\Paiement;
use App\Entity\Inscription;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use EasyCorp\Bundle\EasyAdminBundle\Event\AfterEntityPersistedEvent;
use EasyCorp\Bundle\EasyAdminBundle\Event\BeforeEntityPersistedEvent;

class EasyAdminSubscriber implements EventSubscriberInterface
{
   
    private $objectManager;

    public function __construct(ObjectManager $objectManager)
    {
        $this->objectManager = $objectManager;
    }
    
    public static function getSubscribedEvents()
    {
        return [
            //AfterEntityPersistedEvent::class => ['setPaiementAfterInscription'],
        ];
    }

    // public function setPaiementAfterInscription(AfterEntityPersistedEvent $event)
    // {
    //     $entity = $event->getEntityInstance();

    //     if (!($entity instanceof Inscription)) {
    //         return;
    //     }

    //     $paiement = new Paiement();
    //     $paiement->setMoyen($entity->getMoyenPaiement());
    //     $paiement->setQuantite($entity->getQuantite());
    //     $paiement->setAmount($entity->getAmount());
    //     $paiement->setInscription($entity);

    //     $this->objectManager->persist($paiement);
    //     $this->objectManager->flush();
        
    // }
}