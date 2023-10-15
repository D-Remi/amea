<?php

namespace App\Controller\Admin;

use App\Entity\Paiement;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class PaiementCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Paiement::class;
    }

    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    
    
    public function configureFields(string $pageName): iterable
    {
        return [
            //all action
            
            // only Index
            NumberField::new('id')->hideOnForm(),
            TextField::new('inscription', 'Id de l\'inscrption')
                ->hideOnForm()
                ->formatValue(function ($value, $entity) {
                    return $entity->getInscription();
                }),
            TextField::new('moyen','moyen de paiement'),
            // only forms
            AssociationField::new('inscription','eleve')->onlyOnforms(),
            NumberField::new('amount','montant du paiement'),
            ChoiceField::new('moyen','Moyen de paiement')->setChoices(['cheque' => "cheque",'espece'=> 'espece', 'hello-asso' => 'hello-asso'])->onlyOnForms(),
            // only detail

        ];
    }
}
