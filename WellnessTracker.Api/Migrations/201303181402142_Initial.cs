namespace WellnessTracker.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.GoalCategories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Items",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Type = c.String(),
                        GoalCategory_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.GoalCategories", t => t.GoalCategory_Id)
                .Index(t => t.GoalCategory_Id);
            
            CreateTable(
                "dbo.UserGoals",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        CategoryId = c.Int(nullable: false),
                        ItemId = c.Int(nullable: false),
                        UnitId = c.Int(nullable: false),
                        Value = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.Items", new[] { "GoalCategory_Id" });
            DropForeignKey("dbo.Items", "GoalCategory_Id", "dbo.GoalCategories");
            DropTable("dbo.UserGoals");
            DropTable("dbo.Items");
            DropTable("dbo.GoalCategories");
        }
    }
}
