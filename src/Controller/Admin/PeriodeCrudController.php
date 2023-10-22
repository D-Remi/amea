<?php

namespace App\Controller\Admin;

use DateTime;
use App\Entity\Periode;
use Doctrine\ORM\EntityManagerInterface;
use App\Controller\Admin\PeriodeCrudController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Dto\BatchActionDto;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class PeriodeCrudController extends AbstractCrudController
{
    private $adminUrlGenerator;

    public function __construct(AdminUrlGenerator $adminUrlGenerator,EntityManagerInterface $entityManager)
    {
        $this->adminUrlGenerator = $adminUrlGenerator;
        $this->entityManager = $entityManager;
    }
    
    public static function getEntityFqcn(): string
    {
        return Periode::class;
    }

    /*
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id'),
            TextField::new('title'),
            TextEditorField::new('description'),
        ];
    }
    */

    public function configureActions(Actions $actions): Actions
    {
        $button = Action::new('New dates', 'Periode', 'fa fa-calendar')
            ->linkToRoute('generate_dates_route')->createAsGlobalAction();

        return $actions
        // ...
        //->remove(Crud::PAGE_INDEX, Action::NEW)
        ->remove(Crud::PAGE_INDEX, Action::EDIT)
        ->remove(Crud::PAGE_DETAIL, Action::EDIT)
        ->add(Crud::PAGE_INDEX, $button);
    }

    #[Route('/admin/generate-dates', name: 'generate_dates_route')]
    public function generateDates()
    {

        $currentDate = new DateTime();

        while ($currentDate->format('Y') == date('Y')) {
            $dateEntity = new Periode();
            $dateEntity->setDate(clone $currentDate);
            $this->entityManager->persist($dateEntity);
            $currentDate->modify('+1 day');
        }

        $this->entityManager->flush();

        return $this->redirect($this->container->get(AdminUrlGenerator::class)
        ->setController(PeriodeCrudController::class)
        ->setAction(Action::INDEX)
        ->generateUrl());
    }
}
