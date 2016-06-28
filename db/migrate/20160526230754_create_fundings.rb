class CreateFundings < ActiveRecord::Migration
  def change
    create_table :fundings do |t|
      t.string :candidate
      t.string :donor
      t.decimal :amount
      t.string :position

      t.timestamps null: false
    end
  end
end
